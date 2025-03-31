<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'normal', 'normal_ride', 'normal_fly', 'normal_flyride',
        'neon', 'neon_ride', 'neon_fly', 'neon_flyride',
        'mega', 'mega_ride', 'mega_fly', 'mega_flyride', 'image_link'
    ];

    public function pets()
    {
        return $this->hasMany(Pet::class);
    }
}
