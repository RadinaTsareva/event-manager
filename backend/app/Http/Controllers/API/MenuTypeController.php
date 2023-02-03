<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ErrorResponse;
use App\Http\Resources\Api\TypeResource;
use App\Models\EventType;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class MenuTypeController extends Controller
{
    /**
     * Getting all menu types for user
     *
     * @response
     * [
     *      {
     *          "id": 1,
     *          "name": "sea-food"
     *      }
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
     * @param int $eventTypeId
     * @return array|ErrorResponse
     */
    public function getMenuTypesForUser(int $id, int $eventTypeId): ErrorResponse|array
    {
        $user = User::find($id);
        return $this->validateUserAndMenuTypes($eventTypeId, $user);
    }

    /**
     * Getting all menu types for organizer
     *
     * @response
     * [
     *      {
     *          "id": 1,
     *          "name": "sea-food"
     *      }
     * ]
     *
     * @response 403
     * {
     *      "success": false,
     *      "messages": [
     *          "User either does not exist or it is not an organizer"
     *      ]
     * }
     * @param int $eventTypeId
     * @return array|ErrorResponse
     */

    public function getMenuTypesForOrganizer(int $eventTypeId): array|ErrorResponse
    {
        $user = Auth::user();
        return $this->validateUserAndMenuTypes($eventTypeId, $user);
    }

    protected function validateUserAndMenuTypes(int $eventTypeId, User $user = null): array|ErrorResponse
    {
        $resources = [];
        if (!$user || $user->role != User::ROLE_ORGANISER) {
            return new ErrorResponse(['User either does not exist or it is not an organizer']);
        }

        $eventType = EventType::find($eventTypeId);

        if (!$eventType || $eventType->organizer_id != $user->id) {
            return new ErrorResponse(['Non valid or missing event type']);
        }

        foreach ($user->menuTypes->where('event_type_id', $eventType->id) as $type) {
            $resources[] = new TypeResource($type);
        }
        return $resources;
    }

}
