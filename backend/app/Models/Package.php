<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    public const STATUS_ACTIVO = 'activo';

    public const STATUS_AGOTADO = 'agotado';

    public const STATUS_VENCIDO = 'vencido';

    public const STATUS_INACTIVO = 'inactivo';

    protected $fillable = [
        'establishment_id',
        'title',
        'description',
        'category',
        'original_price',
        'discounted_price',
        'quantity_total',
        'quantity_available',
        'estimated_weight_kg',
        'pickup_start',
        'pickup_end',
        'expires_at',
        'image_url',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'original_price' => 'decimal:2',
            'discounted_price' => 'decimal:2',
            'estimated_weight_kg' => 'decimal:2',
            'pickup_start' => 'datetime',
            'pickup_end' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function establishment()
    {
        return $this->belongsTo(Establishment::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
