<?php

namespace App\Http\Requests\API;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Date;
use Illuminate\Validation\Validator;


/**
 * @property int $organizerId
 * @property string $name
 * @property date $start
 * @property date $end
 * @property string $type
 * @property bool $isCatering
 * @property string $foodType
 * @property string $description
 * @property int $guestsCount
 * @property bool $accommodationNeeded
 */
class EventCreateFirstStageRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'organizerId' => ['required', 'exists:users,id', 'integer'],
            'name' => ['required', 'string'],
            'start' => ['required', 'date', 'before_or_equal:end'],
            'end' => ['required', 'date', 'after_or_equal:start'],
            'type' => ['required', 'integer', 'exists:event_types,id'],
            'isCatering' => ['required', 'boolean'],
            'foodType' => ['required', 'string'],
            'description' => ['required', 'string'],
            'guestsCount' => ['required', 'integer', 'min:1'],
            'accommodationNeeded' => ['required', 'boolean']
        ];
    }

    public function withValidator(Validator $validator)
    {
        $organizer = User::find($this->get('organizerId'));
        if ($organizer) {
            $validator->after(function ($validator) use ($organizer) {
                $evenTypes = $organizer->eventTypes()->pluck('id')->toArray();
                if (in_array($this->get('type'), $evenTypes)) {
                    $validator->errors()->add('type', 'This event type is not part of the organizer\'s ones');
                }
            });
        }
    }
}
