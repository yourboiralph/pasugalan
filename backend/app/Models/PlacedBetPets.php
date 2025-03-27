<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacedBetPets extends Model
{
    protected $fillable = [
        'placed_bet_id',
        'pet_id',
        'side',
    ];

    // Relationship to the Pet model
    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    // Relationship to the PlacedBet model
    public function placedBet()
    {
        return $this->belongsTo(PlacedBet::class);
    }
}
