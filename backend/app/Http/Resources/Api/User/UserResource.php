<?php

namespace App\Http\Resources\Api\User;

use App\Http\Resources\Api\ApiResource;

class UserResource extends ApiResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'email' => $this->resource->email,
            'gender' => $this->resource->gender,
            'blocked' => $this->resource->blocked,
            'role' => $this->resource->role,
            'address' => $this->resource->address,
            'phoneNumber' => $this->resource->phone_number,
            'blacklisted' => $this->blackListed(),
            'pendingEventsCount' => $this->pendingEventsCount()
        ];
    }
}

