<?php

namespace App\Http\Requests\API;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * @property int $eventId
 * @property float $pricePerGuest
 * @property float $priceForFood
 * @property float $priceForAccommodation
 * @property string $accommodationDetails
 * @property string $accommodationContact
 * @property string $place
 * @property string $placeWebsite
 * @property string $placeGoogleMapsLink
 */
class EventCreateSecondStageRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'eventId' => ['required', 'integer', 'exists:events,id'],
            'place' => ['required', 'string'],
            'placeWebsite' => ['required', 'string'],
            'placeGoogleMapsLink' => ['required', 'string'],
            'pricePerGuest' => ['required', 'numeric', 'min:1'],
            'priceForFood' => ['required', 'numeric', 'min:1'],
            'priceForAccommodation' => ['nullable', 'numeric'],
            'accommodationDetails' => ['nullable', 'string'],
            'accommodationContact' => ['nullable', 'string'],
        ];
    }

    public function withValidator(Validator $validator)
    {
        $event = Event::find($this->get('eventId'));
        if($event) {
            $validator->after(function ($validator) use ($event) {
                if($event->needs_hotel) {
                    if(!$this->has('priceForAccommodation') || !$this->has('accommodationDetails') || !!$this->has('accommodationContact')) {
                        $validator->errors()->add('priceForAccommodation', 'This field is required.');
                        $validator->errors()->add('accommodationDetails', 'This field is required.');
                        $validator->errors()->add('accommodationContact', 'This field is required.');
                    }
                }
            });
        }
    }
}
