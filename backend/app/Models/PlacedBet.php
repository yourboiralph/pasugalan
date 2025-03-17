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
        'head_pets_id',
        'tail_pet_id',
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

    // Define the relationship to Pet for head_pet_id
    public function headPet()
    {
        return $this->belongsTo(Pet::class, 'head_pets_id');
    }

    // Define the relationship to Pet for tail_pet_id
    public function tailPet()
    {
        return $this->belongsTo(Pet::class, 'tail_pet_id');
    }
}
