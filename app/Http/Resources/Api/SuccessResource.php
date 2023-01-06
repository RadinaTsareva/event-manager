<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;

class SuccessResource extends ApiResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [];
    }
}
