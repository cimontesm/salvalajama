<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $discountPercent = $this->original_price > 0
            ? (int) round((($this->original_price - $this->discounted_price) / $this->original_price) * 100)
            : 0;

        return [
            'id' => $this->id,
            'establishment_id' => $this->establishment_id,
            'establishment' => new EstablishmentResource($this->whenLoaded('establishment')),
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'original_price' => (float) $this->original_price,
            'discounted_price' => (float) $this->discounted_price,
            'discount_percent' => $discountPercent,
            'quantity_total' => $this->quantity_total,
            'quantity_available' => $this->quantity_available,
            'estimated_weight_kg' => (float) $this->estimated_weight_kg,
            'pickup_start' => $this->pickup_start,
            'pickup_end' => $this->pickup_end,
            'expires_at' => $this->expires_at,
            'image_url' => $this->image_url,
            'status' => $this->status,
        ];
    }
}
