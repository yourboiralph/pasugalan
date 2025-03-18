<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\PetValueController;
use App\Http\Controllers\PlacedBetController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('posts', PostController::class);
Route::apiResource('pets', PetController::class);
Route::apiResource('petsvalue', PetValueController::class);
Route::apiResource('bet/place', PlacedBetController::class);

Route::get('pets/user/{id}', [PetController::class, 'show_filtered_by_id']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
