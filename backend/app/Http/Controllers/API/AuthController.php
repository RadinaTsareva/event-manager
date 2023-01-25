<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\UserChangePasswordRequest;
use App\Http\Requests\API\UserCreateRequest;
use App\Http\Requests\API\UserLoginRequest;
use App\Http\Requests\API\UserUpdateRequest;
use App\Http\Resources\Api\ErrorResponse;
use App\Http\Resources\Api\SuccessResource;
use App\Http\Resources\Api\User\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * @unauthenticated
     * Log in the user
     *
     * @response {
     *  "access_token": "eyJ0eXA...",
     *  "token_type": "Bearer",
     * }
     *
     * @response 403 {
     *  "message": "Email & Password does not match with our record.",
     *  "errors": {
     *  "email": [
     *      "Email & Password does not match with our record."
     *      ]
     *  }
     * }
     */
    public function loginUser(UserLoginRequest $request): JsonResponse
    {
        try {
            $user = User::where('email', $request->email)->first();

            return response()->json(
                [
                    'access_token' => $user->createToken('auth_token')->plainTextToken,
                    'token_type' => 'Bearer',
                ]
            );
        } catch (\Throwable $th) {
            return new ErrorResponse((array)$th->getMessage());
        }
    }

    /**
     * Create User
     * @unauthenticated
     * @param UserCreateRequest $request
     * @return JsonResponse
     *
     * @response {
     *  "access_token": "eyJ0eXA...",
     *  "token_type": "Bearer",
     * }
     *
     * @response 403 {
     *  "message": "The selected gender is invalid. (and 1 more error)",
     *  "errors": {
     *      "gender": [
     *          "The selected gender is invalid."
     *      ],
     *      "email": [
     *          "The email has already been taken."
     *      ]
     *  }
     * }
     */
    public function createUser(UserCreateRequest $request): JsonResponse
    {
        try {
            $user = User::create(
                [
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'gender' => $request->gender,
                    'role' => $request->role,
                    'phone_number' => $request->phone_number,
                    'address' => $request->address,
                ]
            );

            return response()->json(
                [
                    'access_token' => $user->createToken('auth_token')->plainTextToken,
                    'token_type' => 'Bearer',
                ]
            );
        } catch (\Throwable $th) {
            return new ErrorResponse((array)$th->getMessage());
        }
    }


    /** Change password for user
     *
     * @response {
     *  "data": [],
     *  "status": 200
     * }
     *
     * @response 403{
     *  "message": "The current password is match with old password.",
     *   "errors": {
     *       "current_password": [
     *          "The current password is match with old password."
     *       ]
     *    }
     * }
     */
    public function changePassword(UserChangePasswordRequest $request): SuccessResource|ErrorResponse
    {
        try {
            User::find(auth()->user()->id)->update(['password' => Hash::make($request->new_password)]);
            return new SuccessResource([]);
        } catch (\Throwable $th) {
            return new ErrorResponse((array)$th->getMessage());
        }
    }

    /** Update user's info
     *
     * @response {
     *  "data": [],
     *  "status": 200
     * }
     *
     * @response 403 {
     *  "message": "The selected gender is invalid.",
     *   "errors": {
     *       "gender": [
     *          "The selected gender is invalid."
     *       ]
     *    }
     * }
     */
    public function updateUser(UserUpdateRequest $request): SuccessResource|ErrorResponse
    {
        try {
            $user = auth()->user();
            User::find($user->id)->update(
                [
                    'gender' => $request->gender ?? $user->gender,
                    'name' => $request->name ?? $user->name,
                    'email' => $request->email ?? $user->email,
                    'role' => $request->role ?? $user->role, //not sure of that should be changeable
                    'phone_number' => $request->phone_number ?? $user->phone_number,
                    'address' => $request->address ?? $user->address,
                ]
            );

            return new SuccessResource([]);
        } catch (\Throwable $th) {
            return new ErrorResponse((array)$th->getMessage());
        }
    }


    /** Get current user's info
     *
     * @response {
     *   "data": {
     *      "id": 1,
     *      "name": "radina555eee",
     *      "email": "dasdar44d@dada.com",
     *      "gender": "none",
     *      "blocked": 0,
     *      "role": "client",
     *      "address": "Address 1",
     *      "phone-number" : "08990889011"
     *   },
     *   "status": 200
     * }
     */
    public function currentUser(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Logout for user
     *
     * @param Request $request
     * @return void
     */
    public function logoutUser(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
    }
}
