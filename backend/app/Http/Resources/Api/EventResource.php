<?php

namespace App\Http\Resources\Api;

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
            'organizer' => $this->resource->organizer->name,
            'type' => $this->resource->type,
            'moreInfo' => $this->resource->more_info,
            'description' => $this->resource->description,
            'accommodationNeeded' => $this->resource->needs_hotel,
            'place' => $this->resource->place,
            'pricePerGuest' => $this->resource->price_per_person,
            'priceForFood' => $this->resource->price_for_food,
            'foodDetails' => $this->resource->menu_info,
            'priceForAccommodation' => $this->resource->price_for_hotel,
            'accommodationDetails' => $this->resource->place_google_maps_link,
            'accommodationContact' => $this->resource->place_website_link,
        ];
    }
}

