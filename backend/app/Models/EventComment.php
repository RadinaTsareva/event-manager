<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $created_by_user_id
 * @property int $event_id
 * @property string $comment
 * @method static where(string $string, int $id)
 */
class EventComment extends Model
{
    use HasFactory;

    public function event(): BelongsTo
    {
        return $this->BelongsTo(Event::class);
    }

    public function createdBy(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'created_by_user_id');
    }
}
