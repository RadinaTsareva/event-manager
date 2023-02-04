<?php

namespace App\Http\Resources\Api\Event;

use App\Http\Resources\Api\ApiResource;

class EventResource extends ApiResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'status' => $this->resource->status,
            'name' => $this->resource->name,
            'start' => $this->resource->start_date,
            'end' => $this->resource->end_date,
            'organizerName' => $this->resource->organizer->name,
            'organizerEmail' => $this->resource->organizer->email,
            'organizerId' => $this->resource->organizer->id,
            'type' => $this->resource->type,
            'moreInfo' => $this->resource->more_info,
            'description' => $this->resource->description,
            'accommodationNeeded' => $this->resource->needs_hotel,
            'place' => $this->resource->place,
            'pricePerGuest' => $this->resource->price_per_person,
            'priceForFood' => $this->resource->price_for_food,
            'foodDetails' => $this->resource->menu_info,
            'priceForAccommodation' => $this->resource->price_for_hotel,
            'accommodationDetails' => $this->resource->hotel_details,
            'accommodationContact' => $this->resource->hotel_phone_number,
            'accommodationWebsite' => $this->resource->hotel_website_link,
            'hasGivenFeedback' => $this->resource->checkForFeedback(),
            'isPublic' => $this->resource->is_public,
            'guestsCount' => $this->resource->number_of_people,
            'foodType' => $this->resource->food_type
        ];
    }
}
