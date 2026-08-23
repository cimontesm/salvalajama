<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],
        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],
        // Las imágenes de perfil/paquetes se suben a Firebase Storage desde el móvil
        // (expo-image-picker + SDK de Firebase); este disco queda para archivos locales.
    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],
];
