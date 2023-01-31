<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $name
 * @property int $organizer_id
 * @property int $event_type_id
 */
class CateringType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'event_type_id',
        'organizer_id'
    ];

    public function organizer(): BelongsTo
    {
        return $this->BelongsTo(User::class);
    }

    public function eventType(): BelongsTo
    {
        return $this->BelongsTo(EventType::class, 'event_type_id');
    }

}
