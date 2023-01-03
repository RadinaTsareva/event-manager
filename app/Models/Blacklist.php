<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $created_by_user_id
 * @property int $block_user_id
 */
class Blacklist extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'created_by_user_id',
        'block_user_id',
    ];

    public function userCreatedBy(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'created_by_user_id');
    }

    public function userCreatedFor(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'block_user_id');
    }
}
