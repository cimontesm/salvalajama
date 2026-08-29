<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EstablishmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category,
            'address' => $this->address,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'opening_hours' => $this->opening_hours,
            'logo_url' => $this->logo_url,
            'status' => $this->status,
            'packages_count' => $this->when(isset($this->packages_count), (int) $this->packages_count),
            'average_rating' => $this->when(
                $this->reviews_avg_rating !== null,
                fn () => round((float) $this->reviews_avg_rating, 1)
            ),
        ];
    }
}
