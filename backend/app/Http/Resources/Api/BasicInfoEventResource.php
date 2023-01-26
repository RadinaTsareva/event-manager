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
            'organizer' => $this->resource->organizer->name,
            'type' => $this->resource->type,
        ];
    }
}

