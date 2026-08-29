<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\PackageResource;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PackageController
{
    /** Catálogo de ofertas con filtros (categoría, precio, cercanía, franja, etc.). */
    public function index(Request $request)
    {
        $query = Package::query()->with('establishment');

        // Solo publicaciones de establecimientos aprobados: si un establecimiento
        // es suspendido, sus publicaciones dejan de aparecer en el catálogo.
        $query->whereHas('establishment', function ($q) {
            $q->where('status', 'aprobado');
        });

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        if ($request->filled('establishment_id')) {
            $query->where('establishment_id', $request->integer('establishment_id'));
        }

        if ($request->filled('min_price')) {
            $query->where('discounted_price', '>=', $request->float('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('discounted_price', '<=', $request->float('max_price'));
        }

        if ($request->boolean('available')) {
            $query->where('status', 'activo')->where('quantity_available', '>', 0);
        }

        if ($request->filled('q')) {
            $term = '%'.$request->string('q').'%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'ilike', $term)
                    ->orWhere('description', 'ilike', $term);
            });
        }

        if ($request->filled('time_range')) {
            $range = str_replace('ñ', 'n', mb_strtolower($request->string('time_range')));
            switch ($range) {
                case 'manana':
                    $query->whereTime('pickup_start', '>=', '06:00:00')->whereTime('pickup_start', '<', '12:00:00');
                    break;
                case 'tarde':
                    $query->whereTime('pickup_start', '>=', '12:00:00')->whereTime('pickup_start', '<', '18:00:00');
                    break;
                case 'noche':
                    $query->whereTime('pickup_start', '>=', '18:00:00');
                    break;
            }
        }

        // Cercanía por Haversine si llegan lat/lng.
        if ($request->filled('lat') && $request->filled('lng')) {
            $lat = $request->float('lat');
            $lng = $request->float('lng');
            $radiusKm = $request->filled('radius_km') ? $request->float('radius_km') : 10;

            $query->whereHas('establishment', function ($q) use ($lat, $lng, $radiusKm) {
                $haversine = '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))';
                $q->whereRaw("{$haversine} <= ?", [$lat, $lng, $lat, $radiusKm]);
            });
        }

        $packages = $query->orderBy('pickup_start')->paginate(20);

        return PackageResource::collection($packages)->additional(['success' => true]);
    }

    public function show(Request $request, Package $package)
    {
        $package->load('establishment');

        $user = $request->user();
        $isOwner = $user && $user->establishment?->id === $package->establishment_id;
        $isAdmin = $user && $user->role === 'administrador';

        // Si el establecimiento no está aprobado (p. ej. fue suspendido), solo su
        // propio dueño o un administrador pueden seguir viendo la publicación.
        if ($package->establishment->status !== 'aprobado' && ! $isOwner && ! $isAdmin) {
            return response()->json(['success' => false, 'message' => 'Esta publicación ya no está disponible.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new PackageResource($package),
        ]);
    }

    /** Publicaciones del establecimiento autenticado, separadas por estado. */
    public function mine(Request $request)
    {
        $establishment = $request->user()->establishment;
        if (! $establishment) return response()->json(['success' => false, 'message' => 'No tienes un establecimiento asociado.'], 422);

        $this->markExpired($establishment->id);
        $packages = Package::where('establishment_id', $establishment->id)->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'active' => PackageResource::collection($packages->where('status', 'activo')->values()),
                'expired' => PackageResource::collection($packages->where('status', 'vencido')->values()),
                'history' => PackageResource::collection($packages->whereIn('status', ['agotado', 'inactivo', 'vencido'])->values()),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $establishment = $request->user()->establishment;
        if (! $establishment) return response()->json(['success' => false, 'message' => 'No tienes un establecimiento asociado.'], 422);

        $data = $this->validatedData($request, false);
        $data['establishment_id'] = $establishment->id;
        $data['quantity_available'] = $data['quantity_total'];
        $data['status'] = 'activo';

        $package = Package::create($data);
        $package->load('establishment');

        return response()->json(['success' => true, 'data' => new PackageResource($package), 'message' => 'Publicación creada correctamente.'], 201);
    }

    public function update(Request $request, Package $package)
    {
        $this->authorizePackage($request, $package);
        $data = $this->validatedData($request, true);

        $used = $package->quantity_total - $package->quantity_available;
        $newTotal = (int) ($data['quantity_total'] ?? $package->quantity_total);
        $newAvailable = (int) ($data['quantity_available'] ?? $package->quantity_available);

        if ($newTotal < $used) {
            return response()->json(['success' => false, 'message' => "La cantidad total no puede ser menor que las {$used} unidades ya reservadas."], 422);
        }
        if ($newAvailable > ($newTotal - $used)) {
            return response()->json(['success' => false, 'message' => 'El stock disponible supera las unidades que aún pueden venderse.'], 422);
        }

        $data['quantity_total'] = $newTotal;
        $data['quantity_available'] = $newAvailable;
        if ($newAvailable <= 0) $data['status'] = 'agotado';
        elseif (($data['status'] ?? $package->status) === 'agotado') $data['status'] = 'activo';

        $package->update($data);
        $package->load('establishment');
        return response()->json(['success' => true, 'data' => new PackageResource($package), 'message' => 'Publicación actualizada.']);
    }

    public function destroy(Request $request, Package $package)
    {
        $this->authorizePackage($request, $package);

        // Con reservas: se desactiva, no se borra.
        if ($package->reservations()->exists()) {
            $package->update(['status' => 'inactivo']);
            return response()->json(['success' => true, 'message' => 'La publicación fue desactivada y se conserva su historial.']);
        }

        $package->delete();
        return response()->json(['success' => true, 'message' => 'Publicación eliminada.']);
    }

    private function validatedData(Request $request, bool $updating): array
    {
        $rules = [
            'title' => [$updating ? 'sometimes' : 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => [$updating ? 'sometimes' : 'required', 'string', 'max:100'],
            'original_price' => [$updating ? 'sometimes' : 'required', 'numeric', 'min:0'],
            'discounted_price' => [$updating ? 'sometimes' : 'required', 'numeric', 'min:0', 'lte:original_price'],
            'quantity_total' => [$updating ? 'sometimes' : 'required', 'integer', 'min:1'],
            'quantity_available' => [$updating ? 'sometimes' : 'nullable', 'integer', 'min:0'],
            'estimated_weight_kg' => ['nullable', 'numeric', 'min:0'],
            'pickup_start' => [$updating ? 'sometimes' : 'required', 'date'],
            'pickup_end' => [$updating ? 'sometimes' : 'required', 'date', 'after:pickup_start'],
            'expires_at' => ['nullable', 'date'],
            // Acepta URL o imagen en base64.
            'image_url' => ['nullable', 'string', 'max:5000000'],
            'status' => ['sometimes', Rule::in(['activo', 'agotado', 'vencido', 'inactivo'])],
        ];

        return $request->validate($rules);
    }

    private function authorizePackage(Request $request, Package $package): void
    {
        abort_unless($request->user()->establishment?->id === $package->establishment_id, 403, 'No tienes permiso para modificar esta publicación.');
    }

    private function markExpired(int $establishmentId): void
    {
        Package::where('establishment_id', $establishmentId)
            ->whereNotIn('status', ['inactivo', 'vencido'])
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->whereNotNull('expires_at')->where('expires_at', '<', now());
                })->orWhere('pickup_end', '<', now());
            })
            ->update(['status' => 'vencido']);
    }
}
