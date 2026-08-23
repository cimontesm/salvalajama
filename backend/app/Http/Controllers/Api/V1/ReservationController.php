<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\CreateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Package;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationController
{
    /**
     * "Mis pedidos": reservas activas + historial del cliente autenticado.
     */
    public function index(\Illuminate\Http\Request $request)
    {
        $reservations = Reservation::query()
            ->with(['package', 'establishment'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'active' => ReservationResource::collection($reservations->where('status', 'reservado')->values()),
                'history' => ReservationResource::collection($reservations->whereIn('status', ['retirado', 'cancelado'])->values()),
            ],
        ]);
    }

    public function show(\Illuminate\Http\Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== $request->user()->id && $request->user()->role !== 'administrador') {
            return response()->json(['success' => false, 'message' => 'No tienes permiso para ver esta reserva.'], 403);
        }

        $reservation->load(['package', 'establishment']);

        return response()->json([
            'success' => true,
            'data' => new ReservationResource($reservation),
        ]);
    }

    /**
     * Reservar un paquete: baja el inventario automáticamente y genera el
     * código SLJ-####. Devuelve 409 si no hay stock (CLAUDE.md 1.4 y 5.5).
     */
    public function store(CreateReservationRequest $request)
    {
        $quantity = $request->validated('quantity', 1);

        try {
            $reservation = DB::transaction(function () use ($request, $quantity) {
                /** @var Package $package */
                $package = Package::query()->lockForUpdate()->findOrFail($request->validated('package_id'));

                if ($package->status !== 'activo' || $package->quantity_available < $quantity) {
                    throw ValidationException::withMessages([
                        'quantity' => ['No hay suficiente stock disponible para esta oferta.'],
                    ])->status(409);
                }

                $package->quantity_available -= $quantity;
                if ($package->quantity_available <= 0) {
                    $package->status = 'agotado';
                }
                $package->save();

                $reservation = Reservation::create([
                    'code' => $this->generateUniqueCode(),
                    'user_id' => $request->user()->id,
                    'package_id' => $package->id,
                    'establishment_id' => $package->establishment_id,
                    'quantity' => $quantity,
                    'unit_price' => $package->discounted_price,
                    'total' => $package->discounted_price * $quantity,
                    'status' => 'reservado',
                    'pickup_deadline' => $package->pickup_end,
                ]);

                return $reservation->load(['package', 'establishment']);
            });
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 409);
        }

        return response()->json([
            'success' => true,
            'data' => new ReservationResource($reservation),
            'message' => 'Reserva confirmada. Paga en el establecimiento al retirar.',
        ], 201);
    }

    /**
     * Cancela la reserva y repone el stock del paquete.
     */
    public function cancel(\Illuminate\Http\Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No tienes permiso para cancelar esta reserva.'], 403);
        }

        if ($reservation->status !== 'reservado') {
            return response()->json(['success' => false, 'message' => 'Esta reserva ya no se puede cancelar.'], 422);
        }

        DB::transaction(function () use ($reservation) {
            $reservation->update(['status' => 'cancelado']);

            $package = $reservation->package()->lockForUpdate()->first();
            $package->quantity_available += $reservation->quantity;
            if ($package->status === 'agotado' && $package->quantity_available > 0) {
                $package->status = 'activo';
            }
            $package->save();
        });

        return response()->json([
            'success' => true,
            'data' => new ReservationResource($reservation->fresh(['package', 'establishment'])),
            'message' => 'Reserva cancelada y stock repuesto.',
        ]);
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = 'SLJ-'.str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (Reservation::query()->where('code', $code)->exists());

        return $code;
    }
}
