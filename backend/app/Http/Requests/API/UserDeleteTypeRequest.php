<?php

namespace App\Http\Requests\API;

use App\Models\CateringType;
use App\Models\EventType;
use App\Models\MenuType;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * @property mixed $id
 * @property mixed $value
 * @property mixed $type
 *
 **/
class UserDeleteTypeRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'numeric'],
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $type = $this->type;
            if ($type == User::EVENT_TYPES && !EventType::find($this->id)) {
                $validator->errors()->add('id', 'Non existing event type');
            }
            if ($type == User::MENU_TYPES && !MenuType::find($this->id)) {
                $validator->errors()->add('id', 'Non existing menu type');
            }
            if ($type == User::CATERING_TYPES && !CateringType::find($this->id)) {
                $validator->errors()->add('id', 'Non existing catering type');
            }
        });
    }
}
