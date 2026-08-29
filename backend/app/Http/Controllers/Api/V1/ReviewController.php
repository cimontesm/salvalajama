<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Establishment;
use App\Models\Reservation;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController
{
    /** Califica un pedido retirado (1 por reserva). */
    public function store(Request $request)
    {
        $data = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $reservation = Reservation::findOrFail($data['reservation_id']);

        if ($reservation->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'No puedes calificar una reserva que no es tuya.'], 403);
        }

        if ($reservation->status !== 'retirado') {
            return response()->json(['success' => false, 'message' => 'Solo puedes calificar pedidos ya retirados.'], 422);
        }

        if ($reservation->review()->exists()) {
            return response()->json(['success' => false, 'message' => 'Ya calificaste esta reserva.'], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'establishment_id' => $reservation->establishment_id,
            'reservation_id' => $reservation->id,
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $review,
            'message' => '¡Gracias por tu calificación!',
        ], 201);
    }

    public function index(Establishment $establishment)
    {
        $reviews = Review::where('establishment_id', $establishment->id)
            ->select('id', 'user_id', 'rating', 'comment', 'created_at')
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }
}
