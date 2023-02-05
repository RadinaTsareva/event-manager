<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ErrorResponse;
use App\Http\Resources\Api\SuccessResource;
use App\Models\Blacklist;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class BlacklistController extends Controller
{
    /**
     * Blocking user
     *
     * @response
     * {
     *      "data": [],
     *      "status": 200
     * }
     *
     * @response 403 {
     *      "success":false,
     *      "messages":["Non existing user"]
     * }
     * @param int $id
     * @return ErrorResponse|SuccessResource
     */
    public function blockUser(int $id): ErrorResponse|SuccessResource
    {
        $user = User::find($id);
        $currentUser = Auth::user();
        if (!$user) {
            return new ErrorResponse(['Non existing user']);
        }

        if ($user->role == User::ROLE_ADMIN && $currentUser->role != User::ROLE_ADMIN) {
            return new ErrorResponse(['You do not have rights to block this user']);
        }

        if ($id == $currentUser->id) {
            return new ErrorResponse(['You cannot block yourself']);
        }

        Blacklist::create(
            [
                'created_by_user_id' => $currentUser->id,
                'block_user_id' => $id,
            ]
        );

        return new SuccessResource([]);
    }
}
