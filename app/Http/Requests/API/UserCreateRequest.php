<?php

namespace App\Http\Requests\API;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserCreateRequest extends FormRequest
{
    public mixed $name;
    public mixed $gender;
    public mixed $email;
    public mixed $role;
    public mixed $password;

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
        ];
    }
}
