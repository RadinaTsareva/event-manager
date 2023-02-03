<?php

namespace App\Http\Resources\Api;

class TypeResource extends ApiResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'value' => $this->resource->name,
        ];
    }
}
