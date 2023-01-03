<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property string $name
 * @property int $event_id
 * @property string $link
 */
class EventPicture extends Model
{
    use HasFactory;

    public function event(): BelongsTo
    {
        return $this->BelongsTo(Event::class);
    }
}
