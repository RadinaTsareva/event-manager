<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ErrorResponse;
use App\Http\Resources\Api\TypeResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class EventTypeController extends Controller
{
    /**
     * Getting all event types for user
     *
     * @response
     * [
     *      {
     *          "id": 1,
     *          "name": "wedding"
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
     * @return array|ErrorResponse
     */
    public function getEventTypesForUser(int $id): array|ErrorResponse
    {
        $user = User::find($id);

        return $this->validateUserAndGetEventTypes($user);
    }

    /**
     * Getting all event types for organizer
     *
     * @response
     * [
     *      {
     *          "id": 1,
     *          "name": "wedding"
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
     * @return array|ErrorResponse
     */
    public function getEventTypesForOrganizer(): array|ErrorResponse
    {
        $user = Auth::user();
        return $this->validateUserAndGetEventTypes($user);
    }

    protected function validateUserAndGetEventTypes(User $user = null): array|ErrorResponse
    {
        $resources = [];
        if (!$user || $user->role != User::ROLE_ORGANISER) {
            return new ErrorResponse(['User either does not exist or it is not an organizer']);
        }

        foreach ($user->eventTypes as $type) {
            $resources[] = new TypeResource($type);
        }
        return $resources;
    }

}
