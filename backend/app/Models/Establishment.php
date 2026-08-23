<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Establishment extends Model
{
    use HasFactory;

    public const STATUS_PENDIENTE = 'pendiente';

    public const STATUS_APROBADO = 'aprobado';

    public const STATUS_SUSPENDIDO = 'suspendido';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'category',
        'address',
        'latitude',
        'longitude',
        'opening_hours',
        'logo_url',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function packages()
    {
        return $this->hasMany(Package::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
