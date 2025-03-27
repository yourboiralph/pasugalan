<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetValue;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pets = Pet::with('user', 'petValue')->where('user_id', Auth::user()->id)->get();
        return response()->json($pets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Step 1: Validate incoming request
        $fields = $request->validate([
            'roblox_username' => 'required|string',
            'pet_data' => 'required|array',
            'pet_data.*.name' => 'required|string|exists:pet_values,name',
            'pet_data.*.type' => 'required|string|max:255',
        ]);

        // Step 2: Get or create the user by username
        $user = User::firstOrCreate(
            ['username' => $fields['roblox_username']],
            []
        );

        // Step 3: Create pets using pet name lookup
        $pets = [];

        foreach ($fields['pet_data'] as $petItem) {
            $petValue = PetValue::where('name', $petItem['name'])->first();

            if ($petValue) {
                $pets[] = Pet::create([
                    'user_id' => $user->id,
                    'pet_values_id' => $petValue->id,
                    'type' => $petItem['type']
                ]);
            }
        }

        return response()->json([
            'message' => 'Pets successfully created',
            'pets' => $pets
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Pet::find($id);
    }


    /**
     * Display the specified resource.
     */
    public function show_filtered_by_id($id)
    {
        $pets = Pet::where('user_id', $id)->get();

        if($pets->isEmpty()){
            return response()->json([
                'message' => "User has no pets"
            ], 404);
        }

        return response()->json($pets);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Step 1: Validate the request data
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'pet_values_id' => 'required|exists:pet_values,id',
            'type' => 'required|string|max:255'
        ]);

        // Step 2: Create the Pet record
        $pet = Pet::find($id)->update($fields);

        // Step 3: Return a success response
        return response()->json([
            'message' => 'Pet successfully created',
            'pet' => $pet
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Pet::find($id)->delete();

        return ['message' => "Pet was deleted"];
    }
}
