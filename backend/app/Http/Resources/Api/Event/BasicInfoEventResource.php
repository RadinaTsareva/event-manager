<?php

namespace App\Http\Resources\Api\Event;

use App\Http\Resources\Api\ApiResource;

class BasicInfoEventResource extends ApiResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'status' => $this->resource->status,
            'name' => $this->resource->name,
            'type' => $this->resource->type,
            'place' => $this->resource->place,
            'clientEmail'=> $this->resource->client->email,
            'isPublic' => $this->resource->is_public,
            'start' => $this->resource->start_date,
            'end' => $this->resource->end_date,
            'organizerName' => $this->resource->organizer->name,
            'organizerEmail' => $this->resource->organizer->email,
        ];
    }
}

