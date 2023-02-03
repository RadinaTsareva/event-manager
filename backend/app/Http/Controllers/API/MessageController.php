<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\CreateMessageRequest;
use App\Http\Resources\Api\MessageResource;
use App\Http\Resources\Api\SuccessResource;
use App\Http\Resources\Api\User\ChatListUserResource;
use App\Models\Message;
use http\Client\Curl\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPUnit\Exception;

class MessageController extends Controller
{
    /**
     * Getting all user who the current user has chatted
     *
     * @response
     * [
     *      {
     *          "id": 1,
     *          "value": "radina"
     *      }
     * ]
     * @return array
     */
    public function getChatsList(): array
    {
        $currentUser = Auth::user();
        $chatListUsersResources = [];
        foreach ($currentUser->getUserChatList() as $user) {
            $chatListUsersResources[] = new ChatListUserResource($user);
        }

        return $chatListUsersResources;
    }

    /**
     * Get all messages the user has received and sent
     *
     * @response
     * [
     *      {
     *          "id": 1,
     *          "sender": "radina",
     *          "message": "message",
     *          "createdAt": "2023-02-03T10:54:59.000000Z"
     *      }
     * ]
     * @param Request $request
     * @return array
     */
    public function getMessages(Request $request): array
    {
        $user = null;
        if ($request->has('id')) {
            $user = User::find($request->get('id'));
        }

        if (!$user) {
            $user = Auth::user();
        }

        $messageResources = [];
        foreach ($user->messagesReceived as $message) {
            $messageResources[] = new MessageResource($message);
        }
        foreach ($user->messagesSend as $message) {
            $messageResources[] = new MessageResource($message);
        }

        return $messageResources;
    }


    /**
     * Save message
     *
     * @response
     * {
     *      "data": [],
     *      "status": 200
     * }
     *
     * @param CreateMessageRequest $request
     * @return SuccessResource
     */
    public function saveMessage(CreateMessageRequest $request): SuccessResource
    {
        Message::create(
            [
                'user_id_sender' => Auth::user()->id,
                'user_id_receiver' => $request->get('id'),
                'message' => $request->get('message')
            ]
        );


        return new SuccessResource([]);
    }
}
