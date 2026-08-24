<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Establishment;
use Illuminate\Http\Request;

class EstablishmentController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'location_lat' => 'required|numeric',
            'location_lng' => 'required|numeric',
            'business_hours' => 'required|string',
            'category' => 'required|string',
        ]);
        
        $validated['user_id'] = auth()->id();
        $validated['status'] = 'pending';
        
        return response()->json(Establishment::create($validated), 201);
    }

    public function update(Request $request, $id) {
        $establishment = Establishment::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'business_hours' => 'sometimes|string',
            'category' => 'sometimes|string',
        ]);
        
        $establishment->update($validated);
        return response()->json($establishment, 200);
    }
    
    public function updateStatus(Request $request, $id) {
        $validated = $request->validate([
            'status' => 'required|in:approved,suspended,pending'
        ]);
        
        $establishment = Establishment::findOrFail($id);
        $establishment->update(['status' => $validated['status']]);
        
        return response()->json($establishment, 200);
    }
}