<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\UserAddTypeRequest;
use App\Http\Requests\API\UserChangePasswordRequest;
use App\Http\Requests\API\UserCreateRequest;
use App\Http\Requests\API\UserDeleteTypeRequest;
use App\Http\Requests\API\UserLoginRequest;
use App\Http\Requests\API\UserUpdateRequest;
use App\Http\Requests\API\UserUpdateTypeRequest;
use App\Http\Resources\Api\ErrorResponse;
use App\Http\Resources\Api\SuccessResource;
use App\Http\Resources\Api\User\BasicUserResource;
use App\Http\Resources\Api\User\UserResource;
use App\Models\CateringType;
use App\Models\EventType;
use App\Models\MenuType;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Log in the user
     * @unauthenticated
     *
     * @response {
     *  "token": "eyJ0eXA...",
     *  "token_type": "Bearer",
     *  "role" => "admin",
     *  "email" => "radina@gmail.com",
     *  "blacklistedCount" =>  [],
     *  "pendingEventsCount" => 0
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
                    'token' => $user->createToken('auth_token')->plainTextToken,
                    'token_type' => 'Bearer',
                    'role' => $user->role,
                    'email' => $user->email,
                    'blacklisted' => $user->blackListed(),
                    'pendingEventsCount' => $user->pendingEventsCount()
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
     *  "role" => "admin",
     *  "email" => "radina@gmail.com",
     *  "blacklistedCount" =>  [],
     *  "pendingEventsCount" => 0
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
                    'phone_number' => $request->phoneNumber,
                    'address' => $request->address,
                ]
            );

            return response()->json(
                [
                    'token' => $user->createToken('auth_token')->plainTextToken,
                    'token_type' => 'Bearer',
                    'role' => $user->role,
                    'email' => $user->email,
                    'blacklisted' => $user->blackListed(),
                    'pendingEventsCount' => $user->pendingEventsCount()
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
                    'phone_number' => $request->phoneNumber ?? $user->phone_number,
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
     *      "phoneNumber" : "08990889011"
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
    public function logoutUser(Request $request): void
    {
        $request->user()->currentAccessToken()->delete();
    }

    /**
     * Getting all organizers
     *
     * @response {
     *      "data": {
     *          "id": 2,
     *          "name": "radina",
     *          "email": "dasda34e4d@dada.comh"
     *      },
     *      "status": 200
     * }
     *
     * @return array
     */
    public function getOrganizers(): array
    {
        $usersResources = [];
        $users = User::where('role', User::ROLE_ORGANISER)->get();
        if (count($users) != 0) {
            foreach ($users as $user) {
                $usersResources[] = new BasicUserResource($user);
            }
        }

        return $usersResources;
    }

    /**
     * Adding new type (event,menu,catering)
     *
     * @response {
     *      "data": [],
     *      "status": 200
     * }
     *
     * @response 403 {
     *      "message": "The value field is required.",
     *      "errors": {
     *          "value": [
     *              "The value field is required."
     *          ]
     *      }
     * }
     * @param UserAddTypeRequest $request
     * @param string $type
     * @return ErrorResponse|SuccessResource
     */
    public function addNewType(UserAddTypeRequest $request, string $type): ErrorResponse|SuccessResource
    {
        $user = Auth::user();
        if ($request->has('eventTypeId')) {
            $eventType = EventType::find($request->eventTypeId);
            if (!$eventType || $eventType->organizer_id != $user->id) {
                return new ErrorResponse(['You do not have event type named:' . $request->eventType]);
            }

            if ($type == User::MENU_TYPES) {
                MenuType::create(
                    [
                        'name' => $request->value,
                        'event_type_id' => $request->eventTypeId,
                        'organizer_id' => $user->id
                    ]
                );
                return new SuccessResource([]);
            }

            if ($type == User::CATERING_TYPES) {
                CateringType::create(
                    [
                        'name' => $request->value,
                        'event_type_id' => $request->eventTypeId,
                        'organizer_id' => $user->id
                    ]
                );
                return new SuccessResource([]);
            }
        }

        if ($type == User::EVENT_TYPES) {
            EventType::create(
                [
                    'name' => $request->value,
                    'organizer_id' => $user->id
                ]
            );
            return new SuccessResource([]);
        }

        return new ErrorResponse(['Missing data']);
    }

    /**
     * Updating type's info
     *
     * @response {
     *      "data": [],
     *      "status": 200
     * }
     *
     * @response 403
     * {
     *      "message": "The given data was invalid.",
     *      "errors": {
     *          "id": [
     *              null,
     *              "Non existing catering type"
     *          ]
     *      }
     * }
     *
     * @param UserUpdateTypeRequest $request
     * @param string $type
     * @return ErrorResponse|SuccessResource
     */
    public function updateType(UserUpdateTypeRequest $request, string $type): ErrorResponse|SuccessResource
    {
        if ($type == User::MENU_TYPES) {
            $menuType = MenuType::find($request->id);
            if ($menuType) {
                $menuType->name = $request->value;
                $menuType->update();
                return new SuccessResource([]);
            }
        }

        if ($type == User::CATERING_TYPES) {
            $cateringType = CateringType::find($request->id);
            if ($cateringType) {
                $cateringType->name = $request->value;
                $cateringType->update();
                return new SuccessResource([]);
            }
        }

        if ($type == User::EVENT_TYPES) {
            $eventType = EventType::find($request->id);
            if ($eventType) {
                $eventType->name = $request->value;
                $eventType->update();
                return new SuccessResource([]);
            }
        }

        return new ErrorResponse(['Non existing type']);
    }

    /**
     * Deleting type
     *
     * @response {
     *      "data": [],
     *      "status": 200
     * }
     *
     * @response 403
     * {
     *      "message": "Non existing catering type",
     *      "errors": {
     *      "id": [
     *          "Non existing catering type"
     *          ]
     *      }
     * }
     * @param UserDeleteTypeRequest $request
     * @param string $type
     * @return ErrorResponse|SuccessResource
     */
    public function deleteType(UserDeleteTypeRequest $request, string $type): ErrorResponse|SuccessResource
    {
        if ($type == User::MENU_TYPES) {
            MenuType::find($request->id)->delete();
            return new SuccessResource([]);
        }

        if ($type == User::CATERING_TYPES) {
            CateringType::find($request->id)->delete();
            return new SuccessResource([]);
        }

        if ($type == User::EVENT_TYPES) {
            EventType::find($request->id)->delete();
            return new SuccessResource([]);
        }

        return new ErrorResponse(['Nothing to delete']);
    }
}
