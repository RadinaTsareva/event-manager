<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


/**
 * @property int $event_id
 * @property float $rating_for_client
 * @property string $feedback_for_client
 * @property float $rating_for_organiser
 * @property string $feedback_for_organiser
 */
class RatingAndFeedback extends Model
{
    use HasFactory;

    public function event(): BelongsTo
    {
        return $this->BelongsTo(Event::class);
    }
}
