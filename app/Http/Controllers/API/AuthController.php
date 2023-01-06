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
     * @param UserCreateRequest $request
     * @return JsonResponse
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
                    'role' => $request->role
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

    public function changePassword(UserChangePasswordRequest $request): SuccessResource|ErrorResponse
    {
        try {
            User::find(auth()->user()->id)->update(['password' => Hash::make($request->new_password)]);
            return new SuccessResource([]);
        } catch (\Throwable $th) {
            return new ErrorResponse((array)$th->getMessage());
        }
    }

    public function updateUser(UserUpdateRequest $request): SuccessResource|ErrorResponse
    {
        try {
            $user = auth()->user();
            User::find($user->id)->update(
                [
                    'gender' => $request->gender ?? $user->gender,
                    'name' => $request->name ?? $user->name,
                    'email' => $request->email ?? $user->email,
                    'role' => $request->role ?? $user->role //not sure of that should be changeable
                ]
            );

            return new SuccessResource([]);
        } catch (\Throwable $th) {
            return new ErrorResponse((array)$th->getMessage());
        }
    }


    public function currentUser(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function logoutUser(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
    }
}
