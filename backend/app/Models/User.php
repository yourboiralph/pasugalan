<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'profile_image'
        // 'email',
        // 'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        // 'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // 'email_verified_at' => 'datetime',
            // 'password' => 'hashed',
        ];
    }

    public function pets()
    {
        return $this->hasMany(Pet::class);
    }

    // Define the relationship for user_head in PlacedBet
    public function headBets()
    {
        return $this->hasMany(PlacedBet::class, 'user_head');
    }

    // Define the relationship for user_tail in PlacedBet
    public function tailBets()
    {
        return $this->hasMany(PlacedBet::class, 'user_tail');
    }

}
