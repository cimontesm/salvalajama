<?php

use Illuminate\Support\Facades\Route;

// API-only: no hay frontend Blade. Esta ruta solo confirma que el backend responde.
Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Salva la Jama API — ver /api/v1',
    ]);
});
