<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $name
 * @property int $organizer_id
 */
class EventType extends Model
{
    use HasFactory;

    public function organizer(): BelongsTo
    {
        return $this->BelongsTo(User::class);
    }
}
