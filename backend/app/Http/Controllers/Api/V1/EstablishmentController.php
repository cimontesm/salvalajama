<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\EstablishmentResource;
use App\Models\Establishment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EstablishmentController
{
    /** Catálogo de establecimientos (CLAUDE.md 5.5): filtros category, q, status. */
    public function index(Request $request)
    {
        $query = Establishment::query()->withCount('packages')->withAvg('reviews', 'rating');

        // Los clientes solo ven establecimientos aprobados; admin puede filtrar por status.
        if ($request->user()->role === 'administrador') {
            if ($request->filled('status')) {
                $query->where('status', $request->string('status'));
            }
        } else {
            $query->where('status', 'aprobado');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        if ($request->filled('q')) {
            $term = '%'.$request->string('q').'%';
            $query->where('name', 'ilike', $term);
        }

        $establishments = $query->orderBy('name')->paginate(30);

        return EstablishmentResource::collection($establishments)->additional(['success' => true]);
    }

    public function show(Establishment $establishment)
    {
        $establishment->loadCount('packages')->loadAvg('reviews', 'rating');

        return response()->json([
            'success' => true,
            'data' => new EstablishmentResource($establishment),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->establishment) {
            return response()->json(['success' => false, 'message' => 'Ya tienes un establecimiento registrado.'], 422);
        }

        $data = $this->validatedData($request, false);
        $data['user_id'] = $request->user()->id;
        $data['status'] = Establishment::STATUS_PENDIENTE;

        $establishment = Establishment::create($data);

        return response()->json([
            'success' => true,
            'data' => new EstablishmentResource($establishment),
            'message' => 'Establecimiento creado. Queda pendiente de aprobación.',
        ], 201);
    }

    public function update(Request $request, Establishment $establishment)
    {
        abort_unless(
            $establishment->user_id === $request->user()->id || $request->user()->role === 'administrador',
            403,
            'No tienes permiso para editar este establecimiento.'
        );

        $data = $this->validatedData($request, true);
        $establishment->update($data);

        return response()->json([
            'success' => true,
            'data' => new EstablishmentResource($establishment),
            'message' => 'Establecimiento actualizado.',
        ]);
    }

    /** Aprobar / suspender / reactivar (admin). */
    public function updateStatus(Request $request, Establishment $establishment)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in([
                Establishment::STATUS_PENDIENTE,
                Establishment::STATUS_APROBADO,
                Establishment::STATUS_SUSPENDIDO,
            ])],
        ]);

        $establishment->update($data);

        return response()->json([
            'success' => true,
            'data' => new EstablishmentResource($establishment),
            'message' => 'Estado del establecimiento actualizado.',
        ]);
    }

    /** GET /establishment/profile — el propio establecimiento del dueño autenticado. */
    public function mine(Request $request)
    {
        $establishment = $request->user()->establishment;
        if (! $establishment) {
            return response()->json(['success' => false, 'message' => 'No tienes un establecimiento asociado.'], 422);
        }

        $establishment->loadCount('packages')->loadAvg('reviews', 'rating');

        return response()->json([
            'success' => true,
            'data' => new EstablishmentResource($establishment),
        ]);
    }

    /** KPIs de impacto del establecimiento autenticado (dueño). */
    public function myImpact(Request $request)
    {
        $establishment = $request->user()->establishment;
        if (! $establishment) {
            return response()->json(['success' => false, 'message' => 'No tienes un establecimiento asociado.'], 422);
        }

        $reservations = $establishment->reservations()
            ->where('status', 'retirado')
            ->with('package:id,estimated_weight_kg')
            ->get();

        $foodKg = (float) $reservations->sum(fn ($r) => $r->quantity * (float) ($r->package->estimated_weight_kg ?? 0));

        return response()->json([
            'success' => true,
            'data' => [
                'packages_rescued' => (int) $reservations->sum('quantity'),
                'food_rescued_kg' => round($foodKg, 2),
                'co2_avoided_kg' => round($foodKg * (float) env('CO2_FACTOR_PER_KG', 2.5), 2),
                'money_generated' => round((float) $reservations->sum('total'), 2),
                'retired_orders' => $reservations->count(),
            ],
        ]);
    }

    private function validatedData(Request $request, bool $updating): array
    {
        return $request->validate([
            'name' => [$updating ? 'sometimes' : 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => [$updating ? 'sometimes' : 'required', 'string', 'max:100'],
            'address' => [$updating ? 'sometimes' : 'required', 'string'],
            'latitude' => [$updating ? 'sometimes' : 'required', 'numeric', 'between:-90,90'],
            'longitude' => [$updating ? 'sometimes' : 'required', 'numeric', 'between:-180,180'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'logo_url' => ['nullable', 'string'],
        ]);
    }
}
