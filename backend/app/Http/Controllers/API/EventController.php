<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\BasicInfoEventResource;
use App\Http\Resources\Api\ErrorResponse;
use App\Http\Resources\Api\EventResource;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Getting all event's types
     * @response ["wedding","party"]
     *
     * @return array
     */
    public function getTypes(): array
    {
        return Event::TYPES;
    }

    /**
     * Getting all organizers
     *
     * @response ["radina"]
     * @return array
     */
    public function getOrganizers(): array
    {
        return User::where('role', User::ROLE_ORGANISER)->pluck('name')->toArray();
    }

    /**
     * Getting food types for event type
     * @param string $eventType
     * @return ErrorResponse|array
     *
     * @response ["sea-food","sweets"]
     * @response 403 {
     *      "success":false,
     *      "messages":["Wrong event type"]
     * }
     *
     */
    public function getFoodTypesForEventType(string $eventType): ErrorResponse|array
    {
        if (in_array($eventType, Event::TYPES)) {
            return Event::FOOD_TYPE[$eventType];
        }

        return new ErrorResponse((array)'Wrong event type');
    }

    /**
     * Getting all events that are not finished for user
     *
     * @response
     * [
     *    {
     *      "id": 1,
     *      "status": "requested-actions",
     *      "name": "event 1",
     *      "start": null,
     *      "end": null,
     *      "organizer": "radina",
     *      "type": "wedding",
     *      "moreInfo": null,
     *      "description": null,
     *      "accommodationNeeded": 1,
     *      "place": null,
     *      "pricePerGuest": null,
     *      "priceForFood": null,
     *      "foodDetails": null,
     *      "priceForAccommodation": null,
     *      "accommodationDetails": null,
     *      "accommodationContact": null
     *   }
     * ]
     * @return array
     */
    public function getPersonalEvents(): array
    {
        $user = Auth::user();
        $events = Event::where('client_id', $user->id)
            ->orWhere('organizer_id', $user->id)
            ->where('status', '!=', Event::EVENT_STATUS_FINISHED)
            ->get();
        $eventsResources = [];

        if (count($events) != 0) {
            foreach ($events as $event) {
                $eventsResources[] = new EventResource($event);
            }
        }

        return $eventsResources;
    }


    /**
     * Getting all finished events
     * @unauthenticated
     *
     * @response
     * [
     *   {
     *      "id": 1,
     *      "status": "finished",
     *      "name": "event 1",
     *      "start": null,
     *      "end": null,
     *      "organizer": "radina",
     *      "type": "wedding"
     *   }
     * ]
     * @return array
     */
    public function getAllEvents(): array
    {
        $events = Event::where('status', Event::EVENT_STATUS_FINISHED)->get();
        $eventsResources = [];

        if (count($events) != 0) {
            foreach ($events as $event) {
                $eventsResources[] = new BasicInfoEventResource($event);
            }
        }

        return $eventsResources;
    }

    /**
     * Getting event by id
     *
     * @response {
     *  "data": {
     *      "id": 1,
     *      "status": "finished",
     *      "name": "radi",
     *      "start": null,
     *      "end": null,
     *      "organizer": "radina",
     *      "type": "wedding",
     *      "moreInfo": null,
     *      "description": null,
     *      "accommodationNeeded": 1,
     *      "place": null,
     *      "pricePerGuest": null,
     *      "priceForFood": null,
     *      "foodDetails": null,
     *      "priceForAccommodation": null,
     *      "accommodationDetails": null,
     *      "accommodationContact": null
     *    },
     *   "status": 200
     * }
     *
     * @response 403
     * {
     *      "success": false,
     *      "messages": [
     *          "Missing event"
     *      ]
     * }
     *
     * @response 403
     * {
     *      "success": false,
     *      "messages": [
     *          "This event does not belong to the current user."
     *      ]
     * }
     *
     *
     * @param int $id
     * @return ErrorResponse|EventResource
     */
    public function getPersonalEvent(int $id): ErrorResponse|EventResource
    {
        $user = Auth::user();
        $event = Event::find($id);

        if (!$event) {
            return new ErrorResponse((array)'Missing event');
        }

        if (!($event->client_id == $user->id || $event->organizer_id == $user->id)) {
            return new ErrorResponse((array)'This event does not belong to the current user.');
        }

        return new EventResource($event);
    }
}
