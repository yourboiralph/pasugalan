<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PetValuesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('pet_values')->insert([
            [
                'name' => 'cow',
                'normal' => 100,
                'normal_ride' => 200,
                'normal_fly' => null,
                'normal_flyride' => null,
                'neon' => 400,
                'neon_ride' => 800,
                'neon_fly' => null,
                'neon_flyride' => null,
                'mega' => 1200,
                'mega_ride' => 2400,
                'mega_fly' => null,
                'mega_flyride' => null,
                'image_link' => 'https://example.com/images/cow.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'turtle',
                'normal' => 50,
                'normal_ride' => 100,
                'normal_fly' => null,
                'normal_flyride' => null,
                'neon' => 200,
                'neon_ride' => 400,
                'neon_fly' => null,
                'neon_flyride' => null,
                'mega' => 800,
                'mega_ride' => 1600,
                'mega_fly' => null,
                'mega_flyride' => null,
                'image_link' => 'https://example.com/images/turtle.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Add more pet values as needed
        ]);
    }
}
