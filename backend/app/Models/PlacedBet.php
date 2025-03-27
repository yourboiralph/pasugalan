<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlacedBet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_head',
        'user_tail',
        'isActive',
        'result',
    ];

    // Define the relationship to User for user_head
    public function userHead()
    {
        return $this->belongsTo(User::class, 'user_head');
    }

    // Define the relationship to User for user_tail
    public function userTail()
    {
        return $this->belongsTo(User::class, 'user_tail');
    }

    // Relationship to placed_bet_pets
    public function pets()
    {
        return $this->hasMany(PlacedBetPets::class);
    }
}
