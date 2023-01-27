<?php

namespace App\Http\Requests\API;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Date;
use Illuminate\Validation\Rule;

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
        //TODO add rule for the food type
        return [
            'organizerId' => ['required', 'exists:users,id', 'integer'],
            'name' => ['required', 'string'],
            'start' => ['required', 'date', 'before_or_equal:end'],
            'end' => ['required', 'date', 'after_or_equal:start'],
            'type' => ['required', 'string', Rule::in(Event::TYPES)],
            'isCatering' => ['required', 'boolean'],
            'foodType' => ['required', 'string'],
            'description' => ['required', 'string'],
            'guestsCount' => ['required', 'integer', 'min:1'],
            'accommodationNeeded' => ['required', 'boolean']
        ];
    }
}
