<?php

namespace App\Http\Resources\Api\Event;

use App\Http\Resources\Api\ApiResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            'hasGivenFeedback' => $this->checkForFeedback(),
            'isPublic' => $this->resource->is_public
        ];
    }

    protected function checkForFeedback(): bool
    {
        $user = Auth::user();
        if (!$user) {
            return false;
        }
        if ($user->role == User::ROLE_ORGANISER && $this->resource->organizer_id == $user->id) {
            if ($this->resource->ratingAndFeedback->rating_for_client) {
                return true;
            }
        } elseif ($user->role == User::ROLE_CLIENT && $this->resource->client_id == $user->id) {
            if ($this->resource->ratingAndFeedback->rating_for_organiser) {
                return true;
            }
        }

        return false;
    }
}
