<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EventPicture;

class EventPictureController extends Controller
{
    /**
     * Getting all pics for event
     *
     * @response ["https://picsum.photos/200/300"]
     * @param int $id
     * @return array
     */
    public function getEventPictures(int $id): array
    {
        return EventPicture::where('event_id', $id)->pluck('link');
    }
}
