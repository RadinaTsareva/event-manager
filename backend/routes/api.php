<?php

use App\Http\Controllers\API\BlacklistController;
use App\Http\Controllers\API\CateringTypeController;
use App\Http\Controllers\API\EventCommentController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\EventPictureController;
use App\Http\Controllers\API\EventTypeController;
use App\Http\Controllers\API\MenuTypeController;
use App\Http\Controllers\API\MessageController;
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

    Route::get('/events/{eventTypeId}/foodTypes', [EventController::class, 'getFoodTypesForEventType']);
    Route::get('/events/personal/{mouth}/{year}', [EventController::class, 'getPersonalEvents']);
    Route::get('/events/personal/all/{mouth}/{year}',[EventController::class, 'getAllPersonalEvents']);
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
    Route::post('/users/create/{type}', [UserController::class, 'addNewType']);
    Route::post('/users/update/{type}', [UserController::class, 'updateType']);
    Route::post('/users/{type}', [UserController::class, 'deleteType']);

    Route::get('/chat/list', [MessageController::class, 'getChatsList']);
    Route::get('/chat/{id}', [MessageController::class, 'getMessages']);
    Route::post('/chat', [MessageController::class, 'saveMessage']);

    Route::get('/organizers', [UserController::class, 'getOrganizers']);
});

Route::get('/events/{mouth}/{year}', [EventController::class, 'getAllEvents']);

Route::post('/auth/login', [UserController::class, 'loginUser']);
Route::post('/auth/register', [UserController::class, 'createUser']);

