<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetValue;
use App\Models\User;
use Illuminate\Http\Request;

class RobloxAPI extends Controller
{
    public function store(Request $request)
    {
        // Step 1: Validate incoming request
        $fields = $request->validate([
            'roblox_username' => 'required|string',
            'pet_data' => 'required|array',
            'pet_data.*.name' => 'required|string',
            'pet_data.*.type' => 'required|string|max:255',
        ]);

        // Step 2: Get or create the user by username
        $user = User::firstOrCreate(
            ['username' => $fields['roblox_username']],
            []
        );

        // Step 3: Create pets using pet name lookup or creation
        $pets = [];

        foreach ($fields['pet_data'] as $petItem) {
            $petValue = PetValue::firstOrCreate(
                ['name' => $petItem['name']],
                ['value' => 0] // Set a default value or other fields if needed
            );

            $pets[] = Pet::create([
                'user_id' => $user->id,
                'pet_values_id' => $petValue->id,
                'type' => $petItem['type']
            ]);
        }

        return response()->json([
            'message' => 'Pets successfully created',
            'pets' => $pets
        ], 201);
    }

    public function withdraw_pets_api(Request $request)
    {
        $user = User::where('username', $request->roblox_username)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $pets = Pet::with('petValue')->where('user_id', $user->id)
                   ->where('in_withdraw', true)
                   ->get()
                   ->map(function ($pet){
                    return [
                        'pet_id' => $pet->id,
                        'type' => $pet->type,
                        'name' => $pet->petValue->name ?? null,
                    ];
                   });

        return response()->json([
            'pets_to_withdraw' => $pets
        ]);
    }

    public function success_withdraw(Request $request)
    {
        // Step 1: Validate input
        $fields = $request->validate([
            'roblox_username' => 'required|string',
            'pet_data' => 'required|array',
            'pet_data.*.name' => 'required|string',
            'pet_data.*.type' => 'required|string'
        ]);

        // Step 2: Get the user
        $user = User::where('username', $fields['roblox_username'])->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $deleted = [];

        // Step 3: Loop through and delete each matching pet
        foreach ($fields['pet_data'] as $petItem) {
            $petValue = PetValue::where('name', $petItem['name'])->first();

            if (!$petValue) continue;

            $pet = Pet::where('user_id', $user->id)
                ->where('pet_values_id', $petValue->id)
                ->where('type', $petItem['type'])
                ->where('in_withdraw', true) // make sure it's part of the withdraw list
                ->first();

            if ($pet) {
                $deleted[] = $pet->id;
                $pet->delete(); // or $pet->update(['in_withdraw' => false]);
            }
        }

        return response()->json([
            'message' => 'Withdrawn pets removed',
            'deleted_pet_ids' => $deleted
        ]);
    }



}
