<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\API\EventController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/current-user', [AuthController::class, 'currentUser']);
    Route::post('/auth/logout', [AuthController::class, 'logoutUser']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::post('/auth/update-user', [AuthController::class, 'updateUser']);

    Route::get('/events/types', [EventController::class, 'getTypes']);
    Route::get('/events/organizers', [EventController::class, 'getOrganizers']);
    Route::get('/events/{eventType}/foodTypes', [EventController::class, 'getFoodTypesForEventType']);
    Route::get('/events/personal', [EventController::class, 'getPersonalEvents']);
    Route::get('/events/{id}',[EventController::class, 'getPersonalEvent']);
});

Route::get('/events', [EventController::class, 'getAllEvents']);

Route::post('/auth/login', [AuthController::class, 'loginUser']);
Route::post('/auth/register', [AuthController::class, 'createUser']);

