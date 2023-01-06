<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\JsonResponse;

class ErrorResponse extends JsonResponse
{
    public function __construct(array $errors, int $status = 500, array $headers = [], int $options = 0)
    {
        parent::__construct(
            [
                'success' => false,
                'messages' => $errors,
            ],
            $status,
            $headers,
            $options,
        );
    }
}
