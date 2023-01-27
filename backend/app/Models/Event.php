<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Date;
use Illuminate\Validation\Rules\Enum;

/**
 * @property int $organizer_id
 * @property int $client_id
 * @property string $name
 * @property string $type
 * @property enum $status
 * @property string $number_of_people
 * @property enum $food_type
 * @property boolean $needs_hotel
 * @property date $start_date
 * @property date $end_date
 * @property double $price_per_person
 * @property double $price_for_food
 * @property double $price_for_hotel
 * @property string $menu_info
 * @property string $place_google_maps_link
 * @property string $place_website_link
 * @property string $description
 * @property string $more_info
 * @property string $hotel_phone_number
 * @property string $hotel_details
 * @property string $hotel_website_link
 * @property boolean $has_catering
 * @property boolean $is_public
 * @method static find(int $id)
 * @method static where(string $string, string $EVENT_STATUS_FINISHED)
 */
class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'organizer_id',
        'client_id',
        'role',
        'type',
        'status',
        'number_of_people',
        'food_type',
        'needs_hotel',
        'start_date',
        'end_date',
        'price_per_person',
        'price_for_food',
        'price_for_hotel',
        'menu_info',
        'place_google_maps_link',
        'place_website_link',
        'name',
        'description',
        'more_info',
        'has_catering',
        'is_public',
        'hotel_details',
        'hotel_phone_number',
        'hotel_website_link'
    ];

    public const FOOD_TYPES = [
        self::EVENT_TYPE_PARTY => [
            self::FOOD_TYPE_FAST_FOOD
        ],
        self::EVENT_TYPE_WEDDING => [
            self::FOOD_TYPE_SEA_FOOD,
            self::FOOD_TYPE_SWEETS
        ],
    ];

    public const TYPES = [
        self::EVENT_TYPE_WEDDING,
        self::EVENT_TYPE_PARTY,
    ];
    public const EVENT_STATUS_PENDING= 'pending';
    public const EVENT_STATUS_EDIT_PENDING = 'edit_pending';
    public const EVENT_STATUS_ACCEPTED = 'accepted';
    public const EVENT_STATUS_REJECTED = 'rejected';
    public const EVENT_STATUS_FINISHED = 'finished';
    public const EVENT_STATUS_EDITABLE = 'editable';

    public const EVENT_STATUSES = [
        self::EVENT_STATUS_REJECTED,
        self::EVENT_STATUS_ACCEPTED,
        self::EVENT_STATUS_EDIT_PENDING,
        self::EVENT_STATUS_PENDING,
        self::EVENT_STATUS_FINISHED,
        self::EVENT_STATUS_EDITABLE
    ];

    //event types
    public const EVENT_TYPE_WEDDING = 'wedding';
    public const EVENT_TYPE_PARTY = 'party';

    //food types
    public const FOOD_TYPE_SEA_FOOD = 'sea-food';
    public const FOOD_TYPE_FAST_FOOD = 'fast-food';
    public const FOOD_TYPE_SWEETS = 'sweets';


    public function organizer(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'organizer_id');
    }

    public function client(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'client_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(EventComment::class);
    }

    public function pictures(): HasMany
    {
        return $this->hasMany(EventPicture::class);
    }

    public function ratingAndFeedback(): HasOne
    {
        return $this->hasOne(RatingAndFeedback::class);
    }
}
