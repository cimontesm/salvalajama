<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller {
    public function getEstablishmentStats($establishmentId) {
        $stats = Reservation::whereHas('package', function($q) use ($establishmentId) {
            $q->where('establishment_id', $establishmentId);
        })
        ->select(
            DB::raw('COUNT(id) as total_reservations'),
            DB::raw('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as successful_rescues'),
            DB::raw('SUM(total_price) as estimated_revenue')
        )
        ->first();

        return response()->json($stats, 200);
    }
}