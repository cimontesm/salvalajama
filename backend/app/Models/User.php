<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_CLIENTE = 'cliente';

    public const ROLE_ESTABLECIMIENTO = 'establecimiento';

    public const ROLE_ADMINISTRADOR = 'administrador';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'status',
        'city',
        'avatar_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function establishment()
    {
        return $this->hasOne(Establishment::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function deviceTokens()
    {
        return $this->hasMany(DeviceToken::class);
    }

    public function appNotifications()
    {
        return $this->hasMany(AppNotification::class);
    }

    public function isCliente(): bool
    {
        return $this->role === self::ROLE_CLIENTE;
    }

    public function isEstablecimiento(): bool
    {
        return $this->role === self::ROLE_ESTABLECIMIENTO;
    }

    public function isAdministrador(): bool
    {
        return $this->role === self::ROLE_ADMINISTRADOR;
    }

    // Contrato JWTSubject.

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
        ];
    }
}
