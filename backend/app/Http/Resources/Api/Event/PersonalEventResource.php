<?php

namespace App\Http\Resources\Api\Event;

use App\Http\Resources\Api\ApiResource;

class PersonalEventResource extends ApiResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'status' => $this->resource->status,
            'name' => $this->resource->name,
            'organizerEmail' => $this->resource->organizer->email,
            'clientEmail' => $this->resource->client->email,
        ];
    }
}

