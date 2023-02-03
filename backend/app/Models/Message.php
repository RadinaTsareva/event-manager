<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $name
 * @property int $user_id_sender
 * @property int $user_id_receiver
 * @property int $message
 * @method static create(array $array)
 */
class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id_sender',
        'user_id_receiver',
        'message'
    ];

    public function sender(): BelongsTo
    {
        return $this->BelongsTo(User::class, 'user_id_sender');
    }

    public function receiver(): BelongsTo
    {
        return $this->BelongsTo(User::class, 'user_id_receiver');
    }
}
