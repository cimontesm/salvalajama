<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'package' => new PackageResource($this->whenLoaded('package')),
            'establishment' => new EstablishmentResource($this->whenLoaded('establishment')),
            'user' => new UserResource($this->whenLoaded('user')),
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'total' => (float) $this->total,
            'status' => $this->status,
            'pickup_deadline' => $this->pickup_deadline,
            'picked_up_at' => $this->picked_up_at,
            'created_at' => $this->created_at,
        ];
    }
}
