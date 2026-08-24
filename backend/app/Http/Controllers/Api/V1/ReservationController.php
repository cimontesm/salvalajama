<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\ReservationResource;
use App\Models\AppNotification;
use App\Models\Package;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

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

    private function establishmentIndex(Request $request)
    {
        $establishment = $request->user()->establishment;
        if (! $establishment) return response()->json(['success' => false, 'message' => 'No tienes un establecimiento asociado.'], 422);

        $reservations = Reservation::with(['package', 'user'])
            ->where('establishment_id', $establishment->id)->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'pending' => ReservationResource::collection($reservations->where('status', 'reservado')->values()),
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

                $establishmentOwnerId = $package->establishment?->user_id;
                if ($establishmentOwnerId) {
                    AppNotification::create([
                        'user_id' => $establishmentOwnerId, 'type' => 'new_reservation',
                        'title' => 'Nueva reserva',
                        'body' => "Se reservó {$quantity} unidad(es) de {$package->title}.",
                        'data' => ['reservation_id' => $reservation->id, 'package_id' => $package->id],
                    ]);
                    if ($package->quantity_available <= 2) {
                        AppNotification::create([
                            'user_id' => $establishmentOwnerId, 'type' => 'low_stock',
                            'title' => 'Últimas unidades',
                            'body' => "{$package->title} tiene {$package->quantity_available} unidad(es) disponibles.",
                            'data' => ['package_id' => $package->id],
                        ]);
                    }
                }

                AppNotification::create([
                    'user_id' => $request->user()->id, 'type' => 'reservation_confirmed',
                    'title' => 'Reserva confirmada',
                    'body' => "Tu reserva {$reservation->code} fue confirmada. Retírala antes de {$package->pickup_end->format('H:i')}.",
                    'data' => ['reservation_id' => $reservation->id],
                ]);

                return $reservation->load(['package', 'establishment', 'user']);
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
    public function cancel(Request $request, Reservation $reservation)
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

            if ($package->establishment?->user_id) {
                AppNotification::create([
                    'user_id' => $package->establishment->user_id, 'type' => 'reservation_cancelled',
                    'title' => 'Reserva cancelada',
                    'body' => "La reserva {$reservation->code} fue cancelada y se repuso el stock.",
                    'data' => ['reservation_id' => $reservation->id, 'package_id' => $package->id],
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'data' => new ReservationResource($reservation->fresh(['package', 'establishment'])),
            'message' => 'Reserva cancelada y stock repuesto.',
        ]);
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        $establishment = $request->user()->establishment;
        abort_unless($establishment && $reservation->establishment_id === $establishment->id, 403, 'No tienes permiso para actualizar este pedido.');

        $data = $request->validate(['status' => ['required', Rule::in(['retirado', 'cancelado'])]]);
        if ($reservation->status !== 'reservado') return response()->json(['success' => false, 'message' => 'Este pedido ya no está pendiente.'], 422);

        DB::transaction(function () use ($reservation, $data) {
            if ($data['status'] === 'cancelado') {
                $reservation->update(['status' => 'cancelado']);
                $package = $reservation->package()->lockForUpdate()->first();
                $package->quantity_available += $reservation->quantity;
                if ($package->status === 'agotado' && $package->quantity_available > 0) $package->status = 'activo';
                $package->save();
            } else {
                $reservation->update(['status' => 'retirado', 'picked_up_at' => now()]);
            }

            AppNotification::create([
                'user_id' => $reservation->user_id,
                'type' => $data['status'] === 'retirado' ? 'reservation_picked_up' : 'reservation_cancelled_by_establishment',
                'title' => $data['status'] === 'retirado' ? 'Pedido retirado' : 'Reserva cancelada',
                'body' => $data['status'] === 'retirado'
                    ? "Tu reserva {$reservation->code} fue marcada como retirada. ¡Gracias por rescatar alimentos!"
                    : "La reserva {$reservation->code} fue cancelada por el establecimiento.",
                'data' => ['reservation_id' => $reservation->id],
            ]);
        });

        return response()->json(['success' => true, 'data' => new ReservationResource($reservation->fresh(['package', 'establishment'])), 'message' => 'Estado actualizado.']);
    }

    private function createPickupReminders(int $userId, $reservations): void
    {
        foreach ($reservations->where('status', 'reservado') as $reservation) {
            $minutes = now()->diffInMinutes($reservation->pickup_deadline, false);
            if ($minutes >= 0 && $minutes <= 60) {
                $exists = AppNotification::where('user_id', $userId)->where('type', 'pickup_reminder')
                    ->where('data->reservation_id', $reservation->id)->exists();
                if (! $exists) AppNotification::create([
                    'user_id' => $userId, 'type' => 'pickup_reminder', 'title' => 'Se acerca tu retiro',
                    'body' => "Tu reserva {$reservation->code} debe retirarse antes de {$reservation->pickup_deadline->format('H:i')}.",
                    'data' => ['reservation_id' => $reservation->id],
                ]);
            }
        }
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = 'SLJ-'.str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (Reservation::query()->where('code', $code)->exists());

        return $code;
    }
}
