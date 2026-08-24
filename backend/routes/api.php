<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PackageController;
use App\Http\Controllers\Api\V1\ReservationController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ImpactController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);

        Route::middleware('auth:api')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('refresh', [AuthController::class, 'refresh']);
            Route::get('me', [AuthController::class, 'me']);
            Route::put('profile', [AuthController::class, 'updateProfile']);
        });
    });

    Route::middleware('auth:api')->group(function () {
        Route::get('packages', [PackageController::class, 'index']);
        Route::get('packages/{package}', [PackageController::class, 'show']);

        Route::middleware('role:establecimiento')->group(function () {
            Route::get('establishment/packages', [PackageController::class, 'mine']);
            Route::post('establishment/packages', [PackageController::class, 'store']);
            Route::put('establishment/packages/{package}', [PackageController::class, 'update']);
            Route::delete('establishment/packages/{package}', [PackageController::class, 'destroy']);

            Route::get('establishment/reservations', [ReservationController::class, 'establishmentIndex']);
            Route::patch('establishment/reservations/{reservation}/status', [ReservationController::class, 'updateStatus']);
        });

        Route::get('reservations', [ReservationController::class, 'index']);
        Route::get('reservations/{reservation}', [ReservationController::class, 'show']);
        Route::post('reservations', [ReservationController::class, 'store'])->middleware('role:cliente');
        Route::patch('reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->middleware('role:cliente');

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::patch('notifications/{notification}/read', [NotificationController::class, 'read']);
        Route::patch('notifications/read-all', [NotificationController::class, 'readAll']);

        Route::get('impact', [ImpactController::class, 'show'])->middleware('role:cliente,establecimiento');
    });
});
