<?php

namespace App\Http\Requests\API;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * @property mixed $email
 * @property mixed $password
 * @property mixed $name
 * @property mixed $role
 * @property mixed $gender
 * @property mixed $phoneNumber
 * @property mixed $address
 *
 **/
class UserCreateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'gender' => ['required', 'string', Rule::in(User::GENDERS)],
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', 'string', Rule::in(User::ROLES)],
            'password' => ['required', 'confirmed', Password::defaults()],
            'phoneNumber' => ['required', 'string'],
            'address' => ['required', 'string'],
        ];
    }
}
