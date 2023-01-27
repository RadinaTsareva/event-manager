<?php

use App\Http\Controllers\API\EventCommentController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\EventPictureController;
use App\Http\Controllers\Api\UserController;
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
    Route::get('/current-user', [UserController::class, 'currentUser']);
    Route::post('/auth/logout', [UserController::class, 'logoutUser']);
    Route::post('/auth/change-password', [UserController::class, 'changePassword']);
    Route::post('/auth/update-user', [UserController::class, 'updateUser']);

    Route::get('/events/types', [EventController::class, 'getTypes']);
    Route::get('/events/organizers', [UserController::class, 'getOrganizers']);
    Route::get('/events/{eventType}/foodTypes', [EventController::class, 'getFoodTypesForEventType']);
    Route::get('/events/personal', [EventController::class, 'getPersonalEvents']);
    Route::get('/events/personal/all',[EventController::class, 'getAllPersonalEvents']);
    Route::post('/events/{id}/accept', [EventController::class, 'acceptEvent']);
    Route::post('/events/{id}/reject', [EventController::class, 'rejectEvent']);
    Route::get('/events/{id}', [EventController::class, 'getPersonalEvent']);
    Route::get('/events/{id}/comments', [EventCommentController::class, 'getEventComments']);
    Route::get('/events/{id}/pics', [EventPictureController::class, 'getEventPictures']);
    Route::post('/events/new', [EventController::class, 'saveFirstStageEvent']);
    Route::post('/events/{id}', [EventController::class, 'saveSecondStageEvent']);
});

Route::get('/events', [EventController::class, 'getAllEvents']);

Route::post('/auth/login', [UserController::class, 'loginUser']);
Route::post('/auth/register', [UserController::class, 'createUser']);

