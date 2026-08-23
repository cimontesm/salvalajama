<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    public const STATUS_RESERVADO = 'reservado';

    public const STATUS_RETIRADO = 'retirado';

    public const STATUS_CANCELADO = 'cancelado';

    protected $fillable = [
        'code',
        'user_id',
        'package_id',
        'establishment_id',
        'quantity',
        'unit_price',
        'total',
        'status',
        'pickup_deadline',
        'picked_up_at',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'total' => 'decimal:2',
            'pickup_deadline' => 'datetime',
            'picked_up_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function establishment()
    {
        return $this->belongsTo(Establishment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
