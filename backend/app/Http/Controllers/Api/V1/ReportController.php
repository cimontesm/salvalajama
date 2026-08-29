<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Package;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReportController
{
    /** Reportes y estadísticas del establecimiento. */
    public function mine(Request $request)
    {
        $establishment = $request->user()->establishment;
        if (! $establishment) {
            return response()->json(['success' => false, 'message' => 'No tienes un establecimiento asociado.'], 422);
        }

        $reservations = Reservation::where('establishment_id', $establishment->id)
            ->with('package:id,estimated_weight_kg')
            ->get();

        $retiradas = $reservations->where('status', 'retirado');
        $foodKg = (float) $retiradas->sum(fn ($r) => $r->quantity * (float) ($r->package->estimated_weight_kg ?? 0));

        $topPackages = Package::where('establishment_id', $establishment->id)
            ->withCount(['reservations as reservations_count' => function ($q) {
                $q->where('status', 'retirado');
            }])
            ->orderByDesc('reservations_count')
            ->take(5)
            ->get(['id', 'title', 'quantity_total', 'quantity_available']);

        return response()->json([
            'success' => true,
            'data' => [
                'total_reservations' => $reservations->count(),
                'retired_count' => $retiradas->count(),
                'cancelled_count' => $reservations->where('status', 'cancelado')->count(),
                'pending_count' => $reservations->where('status', 'reservado')->count(),
                'estimated_revenue' => round((float) $retiradas->sum('total'), 2),
                'kg_rescued' => round($foodKg, 2),
                'co2_avoided_kg' => round($foodKg * (float) env('CO2_FACTOR_PER_KG', 2.5), 2),
                'top_packages' => $topPackages,
            ],
        ]);
    }
}
