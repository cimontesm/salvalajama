<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Datos demo para que la app se vea como el prototipo (CLAUDE.md 5.7).
     * Ejecutar con: php artisan migrate:fresh --seed
     */
    public function run(): void
    {
        $this->call([
            DemoSeeder::class,
        ]);
    }
}
