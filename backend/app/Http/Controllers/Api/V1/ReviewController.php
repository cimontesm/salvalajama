<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'establishment_id' => 'required|exists:establishments,id',
            'reservation_id' => 'required|exists:reservations,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);
        
        $validated['user_id'] = auth()->id();
        return response()->json(Review::create($validated), 201);
    }

    public function index($establishmentId) {
        return response()->json(
            Review::where('establishment_id', $establishmentId)
                  ->select('id', 'user_id', 'rating', 'comment', 'created_at')
                  ->with('user:id,name')
                  ->get(), 
            200
        );
    }
}