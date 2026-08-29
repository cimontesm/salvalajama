<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\EstablishmentResource;
use App\Http\Resources\PackageResource;
use App\Http\Resources\UserResource;
use App\Models\Establishment;
use App\Models\Package;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController
{
    /** GET /admin/users — lista/gestión de usuarios. */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->string('role'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('q')) {
            $term = '%'.$request->string('q').'%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'ilike', $term)->orWhere('email', 'ilike', $term);
            });
        }

        $users = $query->orderBy('name')->paginate(50);

        return UserResource::collection($users)->additional(['success' => true]);
    }

    /** POST /admin/users — crea un usuario de cualquier rol. */
    public function createUser(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:255',
            'role' => ['required', Rule::in(['cliente', 'establecimiento', 'administrador'])],
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['status'] = 'activo';

        $user = User::create($data);

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
            'message' => 'Usuario creado.',
        ], 201);
    }

    /** PUT /admin/users/{user} — edita datos del usuario. */
    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:255',
            'role' => ['sometimes', Rule::in(['cliente', 'establecimiento', 'administrador'])],
        ]);

        $user->update($data);

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
            'message' => 'Usuario actualizado.',
        ]);
    }

    /** PATCH /admin/users/{user}/status — activar/suspender. */
    public function updateUserStatus(Request $request, User $user)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['activo', 'suspendido'])],
        ]);

        $user->update($data);

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
            'message' => 'Estado del usuario actualizado.',
        ]);
    }

    /** DELETE /admin/users/{user} — elimina un usuario. */
    public function deleteUser(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No puedes eliminar tu propia cuenta.'], 422);
        }

        $user->delete();

        return response()->json(['success' => true, 'message' => 'Usuario eliminado.']);
    }

    /** GET /admin/establishments — todos los establecimientos, cualquier status. */
    public function establishments(Request $request)
    {
        $query = Establishment::query()->withCount('packages')->withAvg('reviews', 'rating');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        $establishments = $query->orderByDesc('created_at')->paginate(50);

        return EstablishmentResource::collection($establishments)->additional(['success' => true]);
    }

    /** POST /admin/establishments — crea un establecimiento y lo asigna a un dueño existente. */
    public function createEstablishment(Request $request)
    {
        $data = $request->validate([
            'owner_email' => ['required', 'email', 'exists:users,email'],
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'address' => 'required|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'opening_hours' => 'nullable|string|max:255',
            'logo_url' => 'nullable|string',
            'status' => ['sometimes', Rule::in(['pendiente', 'aprobado', 'suspendido'])],
        ]);

        $owner = User::where('email', $data['owner_email'])->firstOrFail();

        if ($owner->role !== 'establecimiento') {
            return response()->json(['success' => false, 'message' => 'El dueño debe tener rol "establecimiento".'], 422);
        }
        if ($owner->establishment) {
            return response()->json(['success' => false, 'message' => 'Ese usuario ya tiene un establecimiento.'], 422);
        }

        unset($data['owner_email']);
        $data['user_id'] = $owner->id;
        $data['status'] = $data['status'] ?? 'aprobado';

        $establishment = Establishment::create($data);

        return response()->json([
            'success' => true,
            'data' => new EstablishmentResource($establishment),
            'message' => 'Establecimiento creado.',
        ], 201);
    }

    /** DELETE /admin/establishments/{establishment} */
    public function deleteEstablishment(Establishment $establishment)
    {
        $establishment->delete();

        return response()->json(['success' => true, 'message' => 'Establecimiento eliminado.']);
    }

    /** GET /admin/packages — todas las publicaciones, excepto las de establecimientos suspendidos. */
    public function packages(Request $request)
    {
        $query = Package::query()->with('establishment');

        // Un establecimiento suspendido no debe seguir mostrando sus publicaciones,
        // ni siquiera en el panel de administración.
        $query->whereHas('establishment', function ($q) {
            $q->where('status', '!=', 'suspendido');
        });

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        $packages = $query->orderByDesc('created_at')->paginate(50);

        return PackageResource::collection($packages)->additional(['success' => true]);
    }

    /** GET /admin/monitoring — KPIs globales de la plataforma. */
    public function monitoring()
    {
        $usersByRole = User::query()
            ->select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->pluck('total', 'role');

        $retiradas = Reservation::where('status', 'retirado')
            ->with('package:id,estimated_weight_kg')
            ->get();
        $kg = (float) $retiradas->sum(fn ($r) => $r->quantity * (float) ($r->package->estimated_weight_kg ?? 0));

        return response()->json([
            'success' => true,
            'data' => [
                'users_total' => User::count(),
                'users_by_role' => $usersByRole,
                'establishments_total' => Establishment::count(),
                'establishments_pending' => Establishment::where('status', 'pendiente')->count(),
                'packages_active' => Package::where('status', 'activo')->count(),
                'reservations_total' => Reservation::count(),
                'reservations_retiradas' => $retiradas->count(),
                'kg_rescatados' => round($kg, 2),
                'co2_evitado_kg' => round($kg * (float) env('CO2_FACTOR_PER_KG', 2.5), 2),
            ],
        ]);
    }
}
