<?php

namespace App\Http\Requests\API;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * @property mixed $id
 * @property mixed $message
 *
 **/
class CreateMessageRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:users,id'],
            'message' => ['required', 'string']
        ];
    }
}
