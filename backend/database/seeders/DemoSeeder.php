<?php

namespace Database\Seeders;

use App\Models\Establishment;
use App\Models\Package;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // --- Usuarios base ---
        $ana = User::create([
            'name' => 'Ana Salazar',
            'email' => 'ana@demo.ec',
            'password' => Hash::make('password'),
            'role' => User::ROLE_CLIENTE,
            'status' => 'activo',
            'city' => 'Guayaquil',
        ]);

        User::create([
            'name' => 'Administrador Salva la Jama',
            'email' => 'admin@demo.ec',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMINISTRADOR,
            'status' => 'activo',
            'city' => 'Guayaquil',
        ]);

        $duenoPanaderia = User::create([
            'name' => 'Dueño Panadería La Espiga',
            'email' => 'panaderia@demo.ec',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ESTABLECIMIENTO,
            'status' => 'activo',
            'city' => 'Guayaquil',
        ]);

        $duenoSupermercado = User::create([
            'name' => 'Dueño Supermercado El Ahorro',
            'email' => 'supermercado@demo.ec',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ESTABLECIMIENTO,
            'status' => 'activo',
            'city' => 'Guayaquil',
        ]);

        $duenoCafeteria = User::create([
            'name' => 'Dueño Cafetería Malecón',
            'email' => 'cafeteria@demo.ec',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ESTABLECIMIENTO,
            'status' => 'activo',
            'city' => 'Guayaquil',
        ]);

        // --- Establecimientos ---
        $panaderia = Establishment::create([
            'user_id' => $duenoPanaderia->id,
            'name' => 'Panadería La Espiga',
            'description' => 'Pan y repostería recién horneados todos los días.',
            'category' => 'panadería',
            'address' => 'Urdesa, Guayaquil',
            'latitude' => -2.1560,
            'longitude' => -79.9080,
            'opening_hours' => 'Lun-Sáb 07:00-20:00',
            'status' => 'aprobado',
        ]);

        $supermercado = Establishment::create([
            'user_id' => $duenoSupermercado->id,
            'name' => 'Supermercado El Ahorro',
            'description' => 'Frutas, verduras y lácteos de calidad a buen precio.',
            'category' => 'supermercado',
            'address' => 'Alborada, Guayaquil',
            'latitude' => -2.1170,
            'longitude' => -79.9060,
            'opening_hours' => 'Lun-Dom 08:00-21:00',
            'status' => 'aprobado',
        ]);

        $cafeteria = Establishment::create([
            'user_id' => $duenoCafeteria->id,
            'name' => 'Cafetería Malecón',
            'description' => 'Desayunos y postres frente al río.',
            'category' => 'cafetería',
            'address' => 'Centro, Guayaquil',
            'latitude' => -2.1900,
            'longitude' => -79.8830,
            'opening_hours' => 'Lun-Dom 06:30-19:00',
            'status' => 'aprobado',
        ]);

        // --- Paquetes ---
        $fundaPan = Package::create([
            'establishment_id' => $panaderia->id,
            'title' => 'Funda sorpresa de pan',
            'description' => 'Selección variada de pan del día.',
            'category' => 'panadería',
            'original_price' => 6.00,
            'discounted_price' => 2.25,
            'quantity_total' => 15,
            'quantity_available' => 14,
            'estimated_weight_kg' => 1.2,
            'pickup_start' => now()->setTime(18, 0),
            'pickup_end' => now()->setTime(20, 0),
            'status' => 'activo',
        ]);

        $bandejaBizcochos = Package::create([
            'establishment_id' => $panaderia->id,
            'title' => 'Bandeja de bizcochos',
            'description' => 'Bizcochos horneados hoy, listos para llevar.',
            'category' => 'panadería',
            'original_price' => 5.00,
            'discounted_price' => 2.00,
            'quantity_total' => 10,
            'quantity_available' => 10,
            'estimated_weight_kg' => 0.9,
            'pickup_start' => now()->setTime(18, 0),
            'pickup_end' => now()->setTime(20, 0),
            'status' => 'activo',
        ]);

        $cajaFrutas = Package::create([
            'establishment_id' => $supermercado->id,
            'title' => 'Caja de frutas maduras',
            'description' => 'Frutas de temporada listas para consumir.',
            'category' => 'supermercado',
            'original_price' => 7.00,
            'discounted_price' => 3.50,
            'quantity_total' => 12,
            'quantity_available' => 11,
            'estimated_weight_kg' => 3.0,
            'pickup_start' => now()->setTime(19, 0),
            'pickup_end' => now()->setTime(21, 0),
            'status' => 'activo',
        ]);

        $lacteos = Package::create([
            'establishment_id' => $supermercado->id,
            'title' => 'Lácteos próximos a vencer',
            'description' => 'Leche, yogurt y quesos con fecha próxima.',
            'category' => 'supermercado',
            'original_price' => 8.00,
            'discounted_price' => 4.75,
            'quantity_total' => 8,
            'quantity_available' => 8,
            'estimated_weight_kg' => 2.5,
            'pickup_start' => now()->setTime(19, 0),
            'pickup_end' => now()->setTime(21, 0),
            'status' => 'activo',
        ]);

        $comboDesayuno = Package::create([
            'establishment_id' => $cafeteria->id,
            'title' => 'Combo desayuno rescatado',
            'description' => 'Café, jugo y algo dulce del día.',
            'category' => 'cafetería',
            'original_price' => 5.50,
            'discounted_price' => 2.90,
            'quantity_total' => 10,
            'quantity_available' => 9,
            'estimated_weight_kg' => 0.6,
            'pickup_start' => now()->setTime(17, 0),
            'pickup_end' => now()->setTime(19, 0),
            'status' => 'activo',
        ]);

        $postresDelDia = Package::create([
            'establishment_id' => $cafeteria->id,
            'title' => 'Postres del día',
            'description' => 'Postres sobrantes del día, en buen estado.',
            'category' => 'cafetería',
            'original_price' => 4.00,
            'discounted_price' => 1.80,
            'quantity_total' => 6,
            'quantity_available' => 6,
            'estimated_weight_kg' => 0.8,
            'pickup_start' => now()->setTime(17, 0),
            'pickup_end' => now()->setTime(19, 0),
            'status' => 'activo',
        ]);

        // --- Reservas ---
        // Una reserva activa (SLJ-4902) de Ana.
        Reservation::create([
            'code' => 'SLJ-4902',
            'user_id' => $ana->id,
            'package_id' => $fundaPan->id,
            'establishment_id' => $panaderia->id,
            'quantity' => 1,
            'unit_price' => $fundaPan->discounted_price,
            'total' => $fundaPan->discounted_price,
            'status' => 'reservado',
            'pickup_deadline' => now()->setTime(20, 0),
        ]);

        // Dos reservas retiradas con reseña, para poblar "Mis pedidos" (historial).
        $retirada1 = Reservation::create([
            'code' => 'SLJ-4830',
            'user_id' => $ana->id,
            'package_id' => $cajaFrutas->id,
            'establishment_id' => $supermercado->id,
            'quantity' => 1,
            'unit_price' => $cajaFrutas->discounted_price,
            'total' => $cajaFrutas->discounted_price,
            'status' => 'retirado',
            'pickup_deadline' => now()->subDays(3)->setTime(21, 0),
            'picked_up_at' => now()->subDays(3)->setTime(19, 30),
        ]);

        $retirada2 = Reservation::create([
            'code' => 'SLJ-4751',
            'user_id' => $ana->id,
            'package_id' => $comboDesayuno->id,
            'establishment_id' => $cafeteria->id,
            'quantity' => 1,
            'unit_price' => $comboDesayuno->discounted_price,
            'total' => $comboDesayuno->discounted_price,
            'status' => 'retirado',
            'pickup_deadline' => now()->subDays(7)->setTime(19, 0),
            'picked_up_at' => now()->subDays(7)->setTime(17, 45),
        ]);

        Review::create([
            'user_id' => $ana->id,
            'establishment_id' => $supermercado->id,
            'reservation_id' => $retirada1->id,
            'rating' => 5,
            'comment' => 'Frutas en muy buen estado, excelente precio.',
        ]);

        Review::create([
            'user_id' => $ana->id,
            'establishment_id' => $cafeteria->id,
            'reservation_id' => $retirada2->id,
            'rating' => 4,
            'comment' => 'Buen combo, el café estaba un poco frío.',
        ]);
    }
}
