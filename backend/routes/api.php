<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\PetValueController;
use App\Http\Controllers\PlacedBetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('bet/place', PlacedBetController::class);
    Route::post('bet/{id}/place', [PlacedBetController::class, 'joinBet']);
    Route::get('pets/user/{id}', [PetController::class, 'show_filtered_by_id']);
});


Route::get('bet/getactivebet', [PlacedBetController::class, 'showIsActive']);
Route::apiResource('petsvalue', PetValueController::class);
Route::apiResource('pets', PetController::class);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
