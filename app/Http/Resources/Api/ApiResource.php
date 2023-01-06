<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;

class ApiResource extends JsonResource
{
    protected mixed $status;

    public function __construct($resource, $status = 200)
    {
        $this->status = $status;
        parent::__construct($resource);
    }


    public function with($request)
    {
        return [
            'status' => $this->status,
        ];
    }
    public function withResponse($request, $response)
    {
        $response->setStatusCode($this->status);
    }
}
