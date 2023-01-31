<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ErrorResponse;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class MenuTypeController extends Controller
{
    /**
     * Getting all menu types for user
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
     * @return array|ErrorResponse
     */
    public function getMenuTypesForUser(int $id): ErrorResponse|array
    {
        $user = User::find($id);
        return $this->validateUserAndMenuTypes($user);
    }

    /**
     * Getting all menu types for organizer
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
     * @return array|ErrorResponse
     */

    public function getMenuTypesForOrganizer(): array|ErrorResponse
    {
        $user = Auth::user();
        return $this->validateUserAndMenuTypes($user);
    }

    protected function validateUserAndMenuTypes(User $user = null): array|ErrorResponse
    {
        if (!$user || $user->role != User::ROLE_ORGANISER) {
            return new ErrorResponse(['User either does not exist or it is not an organizer']);
        }

        return $user->menuTypes()->pluck('name')->toArray();
    }

}
