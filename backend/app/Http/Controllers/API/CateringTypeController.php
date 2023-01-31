<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ErrorResponse;
use App\Models\EventType;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CateringTypeController extends Controller
{
    /**
     * Getting all catering types for user
     *
     * @response
     * [
     *     "sea-food"
     * ]
     *
     * @response 403
     * {
     *      "success": false,
     *      "messages": [
     *          "User either does not exist or it is not an organizer"
     *      ]
     * }
     * @param int $id
     * @param string $eventType
     * @return array|ErrorResponse
     */
    public function getCateringTypesForUser(int $id, string $eventType): ErrorResponse|array
    {
        $user = User::find($id);
        return $this->validateUserAndCateringTypes($eventType, $user);
    }

    /**
     * Getting all catering types for organizer
     *
     * @response
     * [
     *     "sea-food"
     * ]
     *
     * @response 403
     * {
     *      "success": false,
     *      "messages": [
     *          "User either does not exist or it is not an organizer"
     *      ]
     * }
     * @param string $eventType
     * @return array|ErrorResponse
     */

    public function getCateringTypesForOrganizer(string $eventType): array|ErrorResponse
    {
        $user = Auth::user();
        return $this->validateUserAndCateringTypes($eventType, $user);
    }

    protected function validateUserAndCateringTypes(string $eventType, User $user = null): array|ErrorResponse
    {
        if (!$user || $user->role != User::ROLE_ORGANISER) {
            return new ErrorResponse(['User either does not exist or it is not an organizer']);
        }

        $eventType = EventType::where('organizer_id', $user->id)->where('name', $eventType)->first();

        if (!$eventType) {
            return new ErrorResponse(['Non valid or missing event type']);
        }

        return $user->cateringTypes()->where('event_type_id', $eventType->id)->pluck('name')->toArray();
    }

}
