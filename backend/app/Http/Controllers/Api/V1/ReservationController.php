<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\CreateReservationRequest;
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
    /** "Mis pedidos": activas + historial del cliente. */
    public function index(Request $request)
    {
        $reservations = Reservation::query()
            ->with(['package', 'establishment', 'review'])
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

    /** Pedidos recibidos por el establecimiento. */
    public function establishmentIndex(Request $request)
    {
        $establishment = $request->user()->establishment;
        if (! $establishment) {
            return response()->json(['success' => false, 'message' => 'No tienes un establecimiento asociado.'], 422);
        }

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

    public function show(Request $request, Reservation $reservation)
    {
        $establishment = $request->user()->establishment;
        $isOwner = $reservation->user_id === $request->user()->id;
        $isEstablishment = $establishment && $reservation->establishment_id === $establishment->id;

        if (! $isOwner && ! $isEstablishment && $request->user()->role !== 'administrador') {
            return response()->json(['success' => false, 'message' => 'No tienes permiso para ver esta reserva.'], 403);
        }

        $reservation->load(['package', 'establishment', 'user', 'review']);

        return response()->json([
            'success' => true,
            'data' => new ReservationResource($reservation),
        ]);
    }

    /** Reserva un paquete: baja stock, genera SLJ-####, 409 sin stock. */
    public function store(CreateReservationRequest $request)
    {
        $quantity = $request->validated('quantity', 1);

        try {
            $reservation = DB::transaction(function () use ($request, $quantity) {
                /** @var Package $package */
                $package = Package::query()->with('establishment')->lockForUpdate()->findOrFail($request->validated('package_id'));

                // Un establecimiento suspendido (o aún no aprobado) no puede recibir reservas nuevas.
                if ($package->establishment?->status !== 'aprobado') {
                    throw ValidationException::withMessages([
                        'package_id' => ['Este establecimiento no está disponible actualmente.'],
                    ])->status(409);
                }

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

    /** Cancela la reserva y repone el stock. */
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
        if ($reservation->status !== 'reservado') {
            return response()->json(['success' => false, 'message' => 'Este pedido ya no está pendiente.'], 422);
        }

        DB::transaction(function () use ($reservation, $data) {
            if ($data['status'] === 'cancelado') {
                $reservation->update(['status' => 'cancelado']);
                $package = $reservation->package()->lockForUpdate()->first();
                $package->quantity_available += $reservation->quantity;
                if ($package->status === 'agotado' && $package->quantity_available > 0) {
                    $package->status = 'activo';
                }
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

        return response()->json([
            'success' => true,
            'data' => new ReservationResource($reservation->fresh(['package', 'establishment'])),
            'message' => 'Estado actualizado.',
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
