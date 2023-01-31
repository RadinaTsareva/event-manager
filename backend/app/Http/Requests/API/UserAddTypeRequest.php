<?php

namespace App\Http\Requests\API;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * @property mixed $type
 * @property mixed $eventTypeId
 * @property mixed $value
 *
 **/
class UserAddTypeRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'eventTypeId' => ['nullable', 'integer'],
            'value' => ['required', 'string']
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $type = $this->type;
            if (!in_array($type, User::TYPES)) {
                $validator->errors()->add('', 'Wrong type');
            }
            if (!$this->has('eventTypeId')) {
                $validator->after(function ($validator) use ($type) {
                    if ($type == 'menu-types' || $type == 'catering-types') {
                        $validator->errors()->add('eventTypeId', 'This field is required.');
                    }
                });
            }
        });
    }
}
