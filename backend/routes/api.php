<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EstablishmentController;
use App\Http\Controllers\Api\V1\ImpactController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\PackageController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\ReservationController;
use App\Http\Controllers\Api\V1\ReviewController;
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

        // --- Catálogo / ofertas ---
        Route::get('packages', [PackageController::class, 'index']);
        Route::get('packages/{package}', [PackageController::class, 'show']);

        // --- Establecimientos ---
        Route::get('establishments', [EstablishmentController::class, 'index']);
        Route::get('establishments/{establishment}', [EstablishmentController::class, 'show']);
        Route::get('establishments/{establishment}/reviews', [ReviewController::class, 'index']);
        Route::post('establishments', [EstablishmentController::class, 'store'])->middleware('role:establecimiento');
        Route::put('establishments/{establishment}', [EstablishmentController::class, 'update'])->middleware('role:establecimiento,administrador');
        Route::patch('establishments/{establishment}/status', [EstablishmentController::class, 'updateStatus'])->middleware('role:administrador');

        // --- Calificaciones ---
        Route::post('reviews', [ReviewController::class, 'store'])->middleware('role:cliente');

        // --- Lado establecimiento (autoservicio, resuelve el establecimiento del usuario autenticado) ---
        Route::middleware('role:establecimiento')->group(function () {
            Route::get('establishment/packages', [PackageController::class, 'mine']);
            Route::post('establishment/packages', [PackageController::class, 'store']);
            Route::put('establishment/packages/{package}', [PackageController::class, 'update']);
            Route::delete('establishment/packages/{package}', [PackageController::class, 'destroy']);

            Route::get('establishment/reservations', [ReservationController::class, 'establishmentIndex']);
            Route::patch('establishment/reservations/{reservation}/status', [ReservationController::class, 'updateStatus']);

            Route::get('establishment/reports', [ReportController::class, 'mine']);
            Route::get('establishment/profile', [EstablishmentController::class, 'mine']);
            Route::get('establishment/impact', [EstablishmentController::class, 'myImpact']);
        });

        // --- Reservas ---
        Route::get('reservations', [ReservationController::class, 'index']);
        Route::get('reservations/{reservation}', [ReservationController::class, 'show']);
        Route::post('reservations', [ReservationController::class, 'store'])->middleware('role:cliente');
        Route::patch('reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->middleware('role:cliente');

        // --- Notificaciones ---
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::patch('notifications/{notification}/read', [NotificationController::class, 'read']);
        Route::patch('notifications/read-all', [NotificationController::class, 'readAll']);
        Route::post('device-tokens', [NotificationController::class, 'registerDeviceToken']);

        // --- Impacto (cliente) ---
        Route::get('impact', [ImpactController::class, 'show'])->middleware('role:cliente,establecimiento');

        // --- Administración ---
        Route::prefix('admin')->middleware('role:administrador')->group(function () {
            Route::get('users', [AdminController::class, 'users']);
            Route::post('users', [AdminController::class, 'createUser']);
            Route::put('users/{user}', [AdminController::class, 'updateUser']);
            Route::patch('users/{user}/status', [AdminController::class, 'updateUserStatus']);
            Route::delete('users/{user}', [AdminController::class, 'deleteUser']);

            Route::get('establishments', [AdminController::class, 'establishments']);
            Route::post('establishments', [AdminController::class, 'createEstablishment']);
            Route::delete('establishments/{establishment}', [AdminController::class, 'deleteEstablishment']);

            Route::get('packages', [AdminController::class, 'packages']);
            Route::get('monitoring', [AdminController::class, 'monitoring']);
        });
    });
});
