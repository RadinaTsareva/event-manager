<?php

namespace App\Http\Resources\Api\User;

use App\Http\Resources\Api\ApiResource;

class BasicUserResource extends ApiResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'email' => $this->resource->email,
        ];
    }
}

