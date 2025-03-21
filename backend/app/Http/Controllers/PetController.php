<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetValue;
use Illuminate\Http\Request;

class PetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Pet::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Step 1: Validate the request data
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'pet_values_id' => 'required|exists:pet_values,id',
            'type' => 'required|string|max:255'
        ]);

        // Step 2: Create the Pet record
        $pet = Pet::create($fields);

        // Step 3: Return a success response
        return response()->json([
            'message' => 'Pet successfully created',
            'pet' => $pet
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
