<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Comment\CommentResource;
use App\Models\EventComment;

class EventCommentController extends Controller
{
    /**
     * Getting all comments for event
     *
     * @response
     * [
     *      {
     *          "userId": 1,
     *          "userName": "radina",
     *          "content": "really good :D"
     *      }
     * ]
     * @param int $id
     * @return array
     */
    public function getEventComments(int $id): array
    {
        $commentResources = [];
        $comments = EventComment::where('event_id', $id)->get();

        if (count($comments) != 0) {
            foreach ($comments as $comment) {
                $commentResources[] = new CommentResource($comment);
            }
        }

        return $commentResources;
    }
}
