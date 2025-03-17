<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'pet_values_id', 'type'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function petValue()
    {
        return $this->belongsTo(PetValue::class, 'pet_values_id');
    }


    // In the Pet model:
    public function placedBets() {
        return $this->hasMany(PlacedBet::class, 'pet_id'); // Assuming the foreign key is 'pet_id'
    }

}
