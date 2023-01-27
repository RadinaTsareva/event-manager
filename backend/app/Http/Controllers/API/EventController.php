<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\EventCreateFirstStageRequest;
use App\Http\Resources\Api\ErrorResponse;
use App\Http\Resources\Api\Event\BasicInfoEventResource;
use App\Http\Resources\Api\Event\EventResource;
use App\Http\Resources\Api\Event\PersonalEventResource;
use App\Http\Resources\Api\SuccessResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Getting all event's types
     *
     * @response ["wedding","party"]
     *
     * @return array
     */
    public function getTypes(): array
    {
        return Event::TYPES;
    }

    /**
     * Getting food types for event type
     *
     * @param Request $request
     * @param string $eventType
     * @return ErrorResponse|array
     *
     * @response ["sea-food","sweets"]
     * @response 403 {
     *      "success":false,
     *      "messages":["Wrong event type"]
     * }
     */
    public function getFoodTypesForEventType(Request $request, string $eventType): ErrorResponse|array
    {
        //TODO do something with isCatering
        if (in_array($eventType, Event::TYPES)) {
            return Event::FOOD_TYPES[$eventType];
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
     *      "organizerName": "radina",
     *      "organizerEmail": "radina@gmail.com",
     *      "organizerId": 1,
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
     *      "accommodationContact": null,
     *      "accommodationWebsite": null,
     *      "hasGivenFeedback": false
     *      "isPublic": false
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
     *
     * @unauthenticated
     *
     * @response
     * [
     *   {
     *      "id": 1,
     *      "status": "finished",
     *      "name": "1",
     *      "type": "11",
     *      "place": null,
     *      "clientEmail": "client@gmail.com",
     *      "isPublic": true,
     *      "start": null,
     *      "end": null,
     *      "organizerName": "radina",
     *      "organizerEmail": "radina@gmail.com"
     *   }
     * ]
     * @return array
     */
    public function getAllEvents(): array
    {
        $events = Event::where('status', Event::EVENT_STATUS_FINISHED)->where('is_public', true)->get();
        $eventsResources = [];

        if (count($events) != 0) {
            foreach ($events as $event) {
                $eventsResources[] = new BasicInfoEventResource($event);
            }
        }

        return $eventsResources;
    }

    /**
     * Getting all owned events
     *
     * @response
     * [
     *      {
     *          "id": 1,
     *          "status": "finished",
     *          "name": "1",
     *          "organizerEmail": "dasda34e4d@dada.comhee",
     *          "clientEmail": "dasda34e4d@dada.comhee"
     *      }
     * ]
     * @return array
     */
    public function getAllPersonalEvents(): array
    {
        $user = Auth::user();
        $events = Event::where('client_id', $user->id)->orWhere('organizer_id', $user->id)->get();
        $eventsResources = [];

        if (count($events) != 0) {
            foreach ($events as $event) {
                $eventsResources[] = new PersonalEventResource($event);
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
     *      "organizerName": "radina",
     *      "organizerEmail": "radina@gmail.com",
     *      "organizerId": 1,
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
     *      "accommodationContact": null,
     *      "accommodationWebsite": null,
     *      "hasGivenFeedback": false,
     *      "isPublic": false
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
     *          "This event is private"
     *      ]
     * }
     *
     *
     * @param int $id
     * @return ErrorResponse|EventResource
     */
    public function getPersonalEvent(int $id): ErrorResponse|EventResource
    {
        $event = Event::find($id);
        $user = Auth::user();

        if (!$event) {
            return new ErrorResponse((array)'Missing event');
        }

        if (!$event->is_public) {
            if (!($event->client_id == $user->id || $event->organizer_id == $user->id)) {
                return new ErrorResponse((array)'This event is private');
            }
        }

        return new EventResource($event);
    }

    /**
     * Accepting event
     *
     * @response 403 {
     *      "success":false,
     *      "messages":["Non existing event"]
     * }
     *
     * @param int $id
     * @return ErrorResponse|void
     */
    public function acceptEvent(int $id)
    {
        //TODO add more checks
        $event = Event::find($id);
        if ($event) {
            $event->status = Event::EVENT_STATUS_ACCEPTED;
            $event->update();
        } else {
            return new ErrorResponse((array)'Non existing event');
        }
    }

    /**
     * Rejecting event
     *
     * @response 403 {
     *      "success":false,
     *      "messages":["Non existing event"]
     * }
     *
     * @param int $id
     * @return ErrorResponse|void
     */
    public function rejectEvent(int $id)
    {
        //TODO add more checks
        $event = Event::find($id);
        if ($event) {
            $event->status = Event::EVENT_STATUS_REJECTED;
            $event->update();
        } else {
            return new ErrorResponse((array)'Non existing event');
        }
    }

    /**
     * Creates an event with basic data from client
     *
     * @response
     * {
     *      "data": [],
     *      "status": 200
     * }
     *
     * @response 403
     * {
     *      "message": "The selected type is invalid.",
     *      "errors": {
     *          "type": [
     *              "The selected type is invalid."
     *          ]
     *      }
     * }
     * @param EventCreateFirstStageRequest $request
     * @return SuccessResource
     */
    public function saveFirstStageEvent(EventCreateFirstStageRequest $request): SuccessResource
    {
        $client = Auth::user();
        Event::create(
            array(
                'name' => $request->name,
                'client_id' => $client->id,
                'organizer_id' => $request->organizerId,
                'status' => Event::EVENT_STATUS_PENDING,
                'type' => $request->type,
                'has_catering' => $request->isCatering,
                'food_type' => $request->foodType,
                'description' => $request->description,
                'number_of_people' => $request->guestsCount,
                'needs_hotel' => $request->accommodationNeeded,
                'start_date' => $request->start,
                'end_date' => $request->end
            )
        );

        return new SuccessResource([]);
    }
}
