<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /** Datos demo. */
    public function run(): void
    {
        $this->call([
            DemoSeeder::class,
        ]);
    }
}
