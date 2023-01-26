<?php

namespace App\Http\Resources\Api;

class BasicInfoEventResource extends ApiResource
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
            'type' => $this->resource->type,
        ];
    }
}

