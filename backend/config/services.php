<?php

return [
    'firebase' => [
        'storage_bucket' => env('FIREBASE_STORAGE_BUCKET'),
    ],

    'fcm' => [
        'server_key' => env('FCM_SERVER_KEY'),
    ],

    'google_maps' => [
        'api_key' => env('GOOGLE_MAPS_API_KEY'),
    ],

    'impact' => [
        'co2_factor_per_kg' => (float) env('CO2_FACTOR_PER_KG', 2.5),
    ],
];
