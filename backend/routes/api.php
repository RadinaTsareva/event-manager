<?php

use App\Http\Controllers\API\BlacklistController;
use App\Http\Controllers\API\CateringTypeController;
use App\Http\Controllers\API\EventCommentController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\EventPictureController;
use App\Http\Controllers\API\EventTypeController;
use App\Http\Controllers\API\MenuTypeController;
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
    Route::get('/users/current-user', [UserController::class, 'currentUser']);
    Route::post('/users/logout', [UserController::class, 'logoutUser']);
    Route::post('/users/change-password', [UserController::class, 'changePassword']);
    Route::post('/users/update', [UserController::class, 'updateUser']);
    Route::post('/users/{id}/blacklist', [BlacklistController::class,'blockUser']);

    Route::get('/events/types', [EventController::class, 'getTypes']);
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

    Route::get('/users/{id}/event-types', [EventTypeController::class, 'getEventTypesForUser']);
    Route::get('/users/event-types', [EventTypeController::class, 'getEventTypesForOrganizer']);
    Route::get('/users/{id}/{eventTypeId}/menu-types', [MenuTypeController::class, 'getMenuTypesForUser']);
    Route::get('/users/{eventTypeId}/menu-types', [MenuTypeController::class, 'getMenuTypesForOrganizer']);
    Route::get('/users/{id}/{eventTypeId}/catering-types', [CateringTypeController::class, 'getCateringTypesForUser']);
    Route::get('/users/{eventTypeId}/catering-types', [CateringTypeController::class, 'getCateringTypesForOrganizer']);
    Route::post('/users/{type}', [UserController::class, 'addNewType']);
    Route::post('/users/{type}', [UserController::class, 'updateType']);
    Route::post('/users/{type}', [UserController::class, 'deleteType']);

    Route::get('/organizers', [UserController::class, 'getOrganizers']);

});

Route::get('/events', [EventController::class, 'getAllEvents']);

Route::post('/users/login', [UserController::class, 'loginUser']);
Route::post('/users/register', [UserController::class, 'createUser']);

