<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Validation\Rules\Enum;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property String $name
 * @property String $email
 * @property enum $gender
 * @property enum $role
 * @property boolean $blocked
 * @property int $max_count_blacklists_in
 * @property string $phone_number
 * @property string $address
 * @property mixed $eventTypes
 * @property mixed $menuTypes
 * @property mixed $cateringTypes
 *
 * @method static create(array $array)
 * @method static where(string $string, mixed $email)
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'gender',
        'role',
        'blocked',
        'max_count_blacklists_in',
        'phone_number',
        'address',
        'password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public const ROLE_ORGANISER = 'organizer';
    public const ROLE_CLIENT = 'client';
    public const ROLE_ADMIN = 'admin';

    public const ROLES = [
        self::ROLE_CLIENT,
        self::ROLE_ORGANISER,
        self::ROLE_ADMIN
    ];

    public const GENDER_FEMALE = 'female';
    public const GENDER_MALE = 'male';
    public const GENDER_NONE = 'none';

    public const GENDERS = [
        self::GENDER_FEMALE,
        self::GENDER_MALE,
        self::GENDER_NONE
    ];

    public const TYPES = [
        SELF::CATERING_TYPES,
        SELF::MENU_TYPES,
        SELF::EVENT_TYPES,
    ];

    public const EVENT_TYPES = 'event-types';
    public const MENU_TYPES = 'menu-types';
    public const CATERING_TYPES = 'catering-types';



    public function eventsOrganized(): HasMany
    {
        return $this->hasMany(Event::class, 'organizer_id', 'id');
    }

    public function eventsClient(): HasMany
    {
        return $this->hasMany(Event::class, 'client_id', 'id');
    }

    public function blacklistsCreated(): HasMany
    {
        return $this->hasMany(Blacklist::class, 'created_by_user_id', 'id');
    }

    public function blacklistsIn(): HasMany
    {
        return $this->hasMany(Blacklist::class, 'block_user_id', 'id');
    }

    public function blackListed()
    {
        return Blacklist::where('created_by_user_id', $this->id)->pluck('block_user_id')->toArray();
    }

    public function pendingEventsCount()
    {
        return Event::where('client_id', $this->id)
            ->orWhere('organizer_id', $this->id)
            ->where('status', '!=', Event::EVENT_STATUS_PENDING)
            ->count();
    }

    public function eventTypes(): HasMany
    {
        return $this->hasMany(EventType::class, 'organizer_id');
    }

    public function menuTypes(): HasMany
    {
        return $this->hasMany(MenuType::class, 'organizer_id');
    }

    public function cateringTypes(): HasMany
    {
        return $this->hasMany(CateringType::class, 'organizer_id');
    }

    public function foodTypesForEventType(int $eventTypeId, string $isCatering): array
    {
        if ($isCatering == 'true') {
            return $this->cateringTypes()->where('event_type_id', $eventTypeId)->pluck('name')->toArray();
        } else {
            return $this->menuTypes()->where('event_type_id', $eventTypeId)->pluck('name')->toArray();
        }
    }

    public function messagesSend(): HasMany
    {
        return $this->hasMany(Message::class, 'user_id_sender');
    }

    public function messagesReceived(): HasMany
    {
        return $this->hasMany(Message::class, 'user_id_receiver');
    }

    public function getUserChatList(): array
    {
        $data = [];
        $messagesReceivers = $this->messagesSend;
        foreach ($messagesReceivers as $messagesReceiver) {
            $user = User::find($messagesReceiver->user_id_receiver);
            //ignoring messages with wrong id's
            if ($user) {
                $data[] = $user;
            }
        }

        return $data;
    }
}
