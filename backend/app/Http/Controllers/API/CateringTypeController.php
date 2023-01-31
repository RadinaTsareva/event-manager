<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ErrorResponse;
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
     * @return array|ErrorResponse
     */
    public function getCateringTypesForUser(int $id): ErrorResponse|array
    {
        $user = User::find($id);
        return $this->validateUserAndCateringTypes($user);
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
     * @return array|ErrorResponse
     */

    public function getCateringTypesForOrganizer(): array|ErrorResponse
    {
        $user = Auth::user();
        return $this->validateUserAndCateringTypes($user);
    }

    protected function validateUserAndCateringTypes(User $user = null): array|ErrorResponse
    {
        if (!$user || $user->role != User::ROLE_ORGANISER) {
            return new ErrorResponse(['User either does not exist or it is not an organizer']);
        }

        return $user->cateringTypes()->pluck('name')->toArray();
    }

}
