<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\UserChangePasswordRequest;
use App\Http\Requests\API\UserCreateRequest;
use App\Http\Requests\API\UserLoginRequest;
use App\Models\User;
use App\Rules\MatchOldPassword;
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
                    'status' => 200,
                    'message' => 'User Logged In Successfully',
                    'token' => $user->createToken('auth_token')->plainTextToken
                ],
            );
        } catch (\Throwable $th) {
            return response()->json(
                [
                    'status' => 500,
                    'message' => $th->getMessage()
                ]
            );
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
                    'status' => 200,
                    'message' => 'User Created Successfully',
                    'token' => $user->createToken('auth_token')->plainTextToken
                ]
            );
        } catch (\Throwable $th) {
            return response()->json(
                [
                    'status' => false,
                    'message' => $th->getMessage()
                ],
                500
            );
        }
    }

    public function changePassword(UserChangePasswordRequest $request): JsonResponse
    {
        try {
            User::find(auth()->user()->id)->update(['password'=> Hash::make($request->new_password)]);

            return response()->json(
                [
                    'status' => 200,
                    'message' => 'Password Changed Successfully'
                ]
            );
        } catch (\Throwable $th) {
            return response()->json(
                [
                    'status' => false,
                    'message' => $th->getMessage()
                ],
                500
            );
        }
    }

    public function currentUser(Request $request)
    {
        return $request->user();
    }

    public function logoutUser(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
    }
}
