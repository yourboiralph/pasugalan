<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'pet_values_id', 'type', 'in_bet', 'in_withdraw'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function petValue()
    {
        return $this->belongsTo(PetValue::class, 'pet_values_id');
    }
    // Define the relationship for head_pet_id in PlacedBet
    public function headBets()
    {
        return $this->hasMany(PlacedBet::class, 'head_pet_id');
    }

    // Define the relationship for tail_pet_id in PlacedBet
    public function tailBets()
    {
        return $this->hasMany(PlacedBet::class, 'tail_pet_id');
    }

}
