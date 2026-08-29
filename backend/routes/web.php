<?php

use Illuminate\Support\Facades\Route;

// Healthcheck; el frontend usa /api/v1.
Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Salva la Jama API — ver /api/v1',
    ]);
});
