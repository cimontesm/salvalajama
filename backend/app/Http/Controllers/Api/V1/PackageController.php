<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\PackageResource;
use App\Models\Package;
use Illuminate\Http\Request;

class PackageController
{
    /**
     * Catálogo de ofertas. Filtros soportados (CLAUDE.md 5.5):
     * category, establishment_id, min_price, max_price, lat, lng, radius_km,
     * available=true, q (búsqueda por título/descripción).
     */
    public function index(Request $request)
    {
        $query = Package::query()->with('establishment');

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        if ($request->filled('establishment_id')) {
            $query->where('establishment_id', $request->integer('establishment_id'));
        }

        if ($request->filled('min_price')) {
            $query->where('discounted_price', '>=', $request->float('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('discounted_price', '<=', $request->float('max_price'));
        }

        if ($request->boolean('available')) {
            $query->where('status', 'activo')->where('quantity_available', '>', 0);
        }

        if ($request->filled('q')) {
            $term = '%'.$request->string('q').'%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'ilike', $term)
                    ->orWhere('description', 'ilike', $term);
            });
        }

        // Búsqueda por cercanía (fórmula de Haversine) si se envían lat/lng/radius_km.
        if ($request->filled('lat') && $request->filled('lng')) {
            $lat = $request->float('lat');
            $lng = $request->float('lng');
            $radiusKm = $request->filled('radius_km') ? $request->float('radius_km') : 10;

            $query->whereHas('establishment', function ($q) use ($lat, $lng, $radiusKm) {
                $haversine = '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))';
                $q->whereRaw("{$haversine} <= ?", [$lat, $lng, $lat, $radiusKm]);
            });
        }

        $packages = $query->orderBy('pickup_start')->paginate(20);

        return PackageResource::collection($packages)->additional(['success' => true]);
    }

    public function show(Package $package)
    {
        $package->load('establishment');

        return response()->json([
            'success' => true,
            'data' => new PackageResource($package),
        ]);
    }
}
