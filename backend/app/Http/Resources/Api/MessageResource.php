<?php

namespace App\Http\Resources\Api;

class MessageResource extends ApiResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->user_id_receiver,
            'sender' => $this->resource->sender->name,
            'message' => $this->resource->message,
            'createdAt' => $this->resource->created_at,
        ];
    }
}
