<?php

namespace App\Http\Requests\API;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * @property mixed $email
 * @property mixed $password
 */
class UserLoginRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required'
        ];
    }

    public function withValidator($validator): void
    {
        if (!$validator->fails()) {
            $validator->after(function ($validator) {
                if (!Auth::attempt($this->only(['email', 'password']))) {
                    $validator->errors()->add('email', 'Email & Password does not match with our record.');
                }
            });
        }
    }
}
