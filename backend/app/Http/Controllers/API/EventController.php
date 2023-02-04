<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\EventCreateFirstStageRequest;
use App\Http\Requests\API\EventCreateSecondStageRequest;
use App\Http\Resources\Api\ErrorResponse;
use App\Http\Resources\Api\Event\BasicInfoEventResource;
use App\Http\Resources\Api\Event\EventResource;
use App\Http\Resources\Api\Event\PersonalEventResource;
use App\Http\Resources\Api\SuccessResource;
use App\Models\Event;
use App\Models\EventType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Getting all event's types
     *
     * @response ["wedding","party"]
     *
     * @response 403 {
     *  "success":false,
     *  "messages":[
     *      "The selected organizer is not an organizer or doesn't exists."
     *  ]
     * }
     *
     * @param Request $request
     * @return array|ErrorResponse
     */
    public function getTypes(Request $request): array|ErrorResponse
    {
        $organizer = User::find($request->get('organizerId'));
        if (!$organizer) {
            return new ErrorResponse((array)'The selected organizer doesn\'t exists.');
        }
        if ($organizer->role != User::ROLE_ORGANISER) {
            return new ErrorResponse((array)'The selected organizer is not an organizer or doesn\'t exists.');
        }
        return $organizer->eventTypes()->pluck('name')->toArray();
    }

    /**
     * Getting food types for event type
     *
     * @param Request $request
     * @param int $eventTypeId
     * @return ErrorResponse|array
     *
     * @response ["sea-food","sweets"]
     * @response 403 {
     *      "success":false,
     *      "messages":["The selected organizer is not an organizer or doesn't exists."]
     * }
     *
     * @response 403 {
     *     "message": "The organizer id field is required.",
     *     "errors": {
     *         "organizerId": [
     *             "The organizer id field is required."
     *          ]
     *      }
     * }
     */
    public function getFoodTypesForEventType(Request $request, int $eventTypeId): ErrorResponse|array
    {
        $user = User::find($request->get('organizerId'));
        if ($user && $user->role == User::ROLE_ORGANISER) {
            $eventType = EventType::find($eventTypeId);
            if ($eventType->organizer_id != $user->id) {
                new ErrorResponse(['The event type does not belong to the user']);
            }
            if (!$request->has('isCatering')) {
                return new ErrorResponse((array)'The field isCatering is required.');
            }
            if ($eventType) {
                return $user->foodTypesForEventType($eventType->id, $request->get('isCatering'));
            }
            return new ErrorResponse((array)'Non existent event type for that organizer');
        }

        return new ErrorResponse((array)'The selected organizer is not an organizer or doesn\'t exists.');
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
     * @param int $month
     * @param int $year
     * @return array
     */
    public function getPersonalEvents(int $month, int $year): array
    {
        $filteredEvents = [];
        $eventsResources = [];
        if (!$month || !$year) {
            $date = Carbon::now();
        } else {
            $date = Carbon::create($year, $month, 1);
        }
        $user = Auth::user();
        $events = Event::where('client_id', $user->id)
            ->orWhere('organizer_id', $user->id)
            ->get();

        foreach ($events as $event) {
            if (
                Carbon::createFromFormat('Y-m-d H:i:s', $event->start_date)->gte($date->firstOfMonth()) &&
                Carbon::createFromFormat('Y-m-d H:i:s', $event->end_date)->lte($date->endOfMonth())
            ) {
                $filteredEvents[] = $event;
            }
        }

        if (count($filteredEvents) != 0) {
            foreach ($filteredEvents as $event) {
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
     * @param Request $request
     * @param int|null $month
     * @param int|null $year
     * @return array
     */
    public function getAllEvents(Request $request, int $month = null, int $year = null): array
    {
        if (!$month || !$year) {
            $date = Carbon::now();
        } else {
            $date = Carbon::create($year, $month);
        }
        if ($request->has('organizerId')) {
            $events = Event::where('organizer_id', $request->get('organizerId'))
                ->get();
        } else {
            $events = Event::where('status', Event::EVENT_STATUS_FINISHED)
                ->where('is_public', true)
                ->get();
        }

        $filteredEvents = [];
        foreach ($events as $event) {
            if (
                Carbon::createFromFormat('Y-m-d H:i:s', $event->start_date)->gte($date->firstOfMonth()) &&
                Carbon::createFromFormat('Y-m-d H:i:s', $event->end_date)->lte($date->endOfMonth())
            ) {
                $filteredEvents[] = $event;
            }
        }

        $eventsResources = [];

        if (count($filteredEvents) != 0) {
            foreach ($filteredEvents as $event) {
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
        $events = Event::where('client_id', $user->id)
            ->orWhere('organizer_id', $user->id)
            ->get();
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
     * @response
     *   [
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
     *    ],
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
     * @return JsonResponse|ErrorResponse
     */
    public function getPersonalEvent(int $id): JsonResponse|ErrorResponse
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
        return response()->json(
            [
                'id' => $event->id,
                'status' => $event->status,
                'name' => $event->name,
                'start' => $event->start_date,
                'end' => $event->end_date,
                'organizerName' => $event->organizer->name,
                'organizerEmail' => $event->organizer->email,
                'organizerId' => $event->organizer->id,
                'type' => $event->type,
                'moreInfo' => $event->more_info,
                'description' => $event->description,
                'accommodationNeeded' => $event->needs_hotel,
                'place' => $event->place,
                'placeWebsiteLink' => $event->place_website_link,
                'placeGoogleMapsLink' => $event->place_google_maps_link,
                'pricePerGuest' => $event->price_per_person,
                'priceForFood' => $event->price_for_food,
                'foodDetails' => $event->menu_info,
                'priceForAccommodation' => $event->price_for_hotel,
                'accommodationDetails' => $event->hotel_details,
                'accommodationContact' => $event->hotel_phone_number,
                'accommodationWebsite' => $event->hotel_website_link,
                'hasGivenFeedback' => $event->checkForFeedback(),
                'isPublic' => $event->is_public,
                'guestsCount' => $event->number_of_people,
                'foodType' => $event->food_type
            ]
        );
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
     *
     * @response 403
     * {
     *      "message": "This event type is not part of the organizer's ones (and 1 more error)",
     *      "errors": {
     *          "type": [
     *              "This event type is not part of the organizer's ones",
     *              "This food type is not part of the organizer's menu,catering options"
     *          ]
     *      }
     * }
     * @param EventCreateFirstStageRequest $request
     * @return SuccessResource
     */
    public function saveFirstStageEvent(EventCreateFirstStageRequest $request): SuccessResource
    {
        $client = Auth::user();
        $type = EventType::find($request->type);
        Event::create(
            array(
                'name' => $request->name,
                'client_id' => $client->id,
                'organizer_id' => $request->organizerId,
                'status' => Event::EVENT_STATUS_PENDING,
                'type' => $type ?? '',
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

    /**
     * Saves the event's data that the organizer is putting
     *
     * @response
     * {
     *      "data": [],
     *      "status": 200
     * }
     *
     * @response 403
     * {
     *      "message": "This field is required. (and 2 more errors)",
     *      "errors": {
     *          "priceForAccommodation": [
     *              "This field is required."
     *          ],
     *          "accommodationDetails": [
     *              "This field is required."
     *          ],
     *          "accommodationContact": [
     *              "This field is required."
     *          ]
     *      }
     * }
     * @param EventCreateSecondStageRequest $request
     * @return ErrorResponse|SuccessResource
     */
    public function saveSecondStageEvent(EventCreateSecondStageRequest $request): ErrorResponse|SuccessResource
    {
        $event = Event::find($request->eventId);
        if (!$event) {
            return new ErrorResponse(['Non existing event']);
        }

        $event->price_per_person = $request->pricePerGuest;
        $event->price_for_food = $request->priceForFood;
        $event->place = $request->place;
        $event->place_google_maps_link = $request->placeGoogleMapsLink;
        $event->place_website_link = $request->placeWebsite;
        if ($event->needs_hotel) {
            $event->price_for_hotel = $request->priceForAccommodation ?? null;
            $event->hotel_phone_number = $request->accommodationContact ?? null;
            $event->hotel_details = $request->accommodationDetails ?? null;
        }
        $event->status = Event::EVENT_STATUS_EDITABLE;
        $event->update();

        return new SuccessResource([]);
    }
}
