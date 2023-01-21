<?php

namespace App\Http\Requests\API;

use App\Models\User;
use App\Rules\MatchOldPassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * @property mixed $email
 * @property mixed $name
 * @property mixed $role
 * @property mixed $gender
 */
class UserUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string'],
            'gender' => ['nullable', 'string', Rule::in(User::GENDERS)],
            'email' => ['nullable', 'email', 'unique:users,email'],
            'role' => ['nullable', 'string', Rule::in(User::ROLES)],
        ];
    }
}
