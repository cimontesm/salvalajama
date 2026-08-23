<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImpactController
{
    public function show(Request $request)
    {
        $user = $request->user();
        $query = Reservation::query()->where('status', 'retirado');

        if ($user->isCliente()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isEstablecimiento()) {
            $establishment = $user->establishment;
            if (! $establishment) return response()->json(['success' => false, 'message' => 'No tienes un establecimiento asociado.'], 422);
            $query->where('establishment_id', $establishment->id);
        } else {
            return response()->json(['success' => false, 'message' => 'El indicador no está disponible para administradores en este módulo.'], 422);
        }

        $reservations = $query->with('package:id,estimated_weight_kg')->get();
        $packagesRescued = (int) $reservations->sum('quantity');
        $foodKg = (float) $reservations->sum(fn ($r) => $r->quantity * (float) ($r->package->estimated_weight_kg ?? 0));
        $savedMoney = (float) $reservations->sum('total');

        $totalPublished = DB::table('packages')
            ->when($user->isEstablecimiento(), fn ($q) => $q->where('establishment_id', $user->establishment->id))
            ->sum('quantity_total');
        $rescueRate = $totalPublished > 0 ? round(($packagesRescued / $totalPublished) * 100, 1) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'packages_rescued' => $packagesRescued,
                'food_rescued_kg' => round($foodKg, 2),
                'money_saved' => round($savedMoney, 2),
                'rescue_rate_percent' => $rescueRate,
                'retired_orders' => $reservations->count(),
            ],
        ]);
    }
}
