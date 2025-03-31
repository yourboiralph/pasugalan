<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\PetValueController;
use App\Http\Controllers\PlacedBetController;
use App\Http\Controllers\RobloxAPI;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('bet/place', PlacedBetController::class);
    Route::post('bet/{id}/place', [PlacedBetController::class, 'joinBet']);
    Route::get('pets/user/{id}', [PetController::class, 'show_filtered_by_id']);
    Route::apiResource('pets', PetController::class);
    Route::post('pets/withdraw', [PetController::class, 'withdraw_pets']);
    Route::post('pets/cancelwithdraw', [PetController::class, 'cancel_withdraw_pets']);
    Route::get('getinventory', [PetController::class, 'getInventory']);
});

Route::post('/robloxapi', [RobloxAPI::class, 'store']);
Route::post('/robloxapi/withdraw', [RobloxAPI::class, 'withdraw_pets_api']);
Route::post('/robloxapi/success_withdraw', [RobloxAPI::class, 'success_withdraw']);
Route::get('bet/getactivebet', [PlacedBetController::class, 'showIsActive']);
Route::get('petsall', [PetController::class, 'getAllIndex']);
Route::apiResource('petsvalue', PetValueController::class);


Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
