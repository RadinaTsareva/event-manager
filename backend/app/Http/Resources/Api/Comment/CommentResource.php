<?php

namespace App\Http\Resources\Api\Comment;

use App\Http\Resources\Api\ApiResource;

class CommentResource extends ApiResource
{
    public function toArray($request): array
    {
        return [
            'userId' => $this->resource->created_by_user_id,
            'userName' => $this->resource->createdBy->name,
            'content' => $this->resource->comment,
        ];
    }
}

