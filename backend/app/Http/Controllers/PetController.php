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
        $pets = Pet::with('user', 'petValue')->where('user_id', Auth::user()->id)->where('in_bet', false)->where('in_withdraw', false)->get();
        return response()->json($pets);
    }

    public function getInventory(){
        $pets = Pet::with('user', 'petValue')->where('user_id', Auth::user()->id)->get();
        return response()->json($pets);
    }

    public function getAllIndex(){
        $pets = Pet::with('petValue', 'user')->paginate(15);
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
            $imageLink = "https://cdn.playadopt.me/items/{$petItem['name']}.png";

            $petValue = PetValue::firstOrCreate(
                ['name' => $petItem['name']],
                ['image_link' => $imageLink]
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


    public function withdraw_pets(Request $request)
    {
        $fields = $request->validate([
            'roblox_username' => 'required|string',
            'pet_data' => 'required|array',
            'pet_data.*' => 'integer|distinct'
        ]);

        // Fetch all pets in one query for efficiency
        $pets = Pet::whereIn('id', $fields['pet_data'])->get();

        // Check if all pets exist
        if ($pets->count() !== count($fields['pet_data'])) {
            return response()->json([
                'message' => 'Some pets were not found.'
            ], 404);
        }

        // Check if any pet is already in withdraw
        $alreadyInWithdraw = $pets->filter(function ($pet) {
            return $pet->in_withdraw;
        });

        if ($alreadyInWithdraw->isNotEmpty()) {
            return response()->json([
                'message' => 'Cannot proceed: Some pets are already marked as in withdraw.',
                'already_in_withdraw_ids' => $alreadyInWithdraw->pluck('id')
            ], 422);
        }

        // If all checks pass, update all
        foreach ($pets as $pet) {
            $pet->update([
                'in_withdraw' => true
            ]);
        }

        return response()->json([
            'message' => 'Pets successfully marked as in withdraw.'
        ], 200);
    }


    public function cancel_withdraw_pets(Request $request)
    {
        $fields = $request->validate([
            'roblox_username' => 'required|string',
            'pet_data' => 'required|array',
            'pet_data.*' => 'integer|distinct'
        ]);

        $pets = Pet::whereIn('id', $fields['pet_data'])->get();

        if ($pets->count() !== count($fields['pet_data'])) {
            return response()->json([
                'message' => 'Some pets were not found.'
            ], 404);
        }

        // Check if all pets are actually in withdraw
        $notInWithdraw = $pets->filter(function ($pet) {
            return !$pet->in_withdraw;
        });

        if ($notInWithdraw->isNotEmpty()) {
            return response()->json([
                'message' => 'Cannot proceed: Some pets are not in withdraw.',
                'not_in_withdraw_ids' => $notInWithdraw->pluck('id')
            ], 422);
        }

        // Cancel withdraw
        foreach ($pets as $pet) {
            $pet->update([
                'in_withdraw' => false
            ]);
        }

        return response()->json([
            'message' => 'Pets successfully removed from withdraw.'
        ], 200);
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
            'roblox_username' => 'required|string',
            'pet_data' => 'required|array',
            'pet_data.*.name' => 'required|string|exists:pet_values,name',
            'pet_data.*.type' => 'required|string|max:255',
        ]);

        $user = User::where('username', $request->roblox_username)->first();

        $pets = [];

        foreach ($fields['pet_data'] as $petItem) {
            $petValue = PetValue::where('name', $petItem['name'])->first();

            if ($petValue) {
                $pets[] = Pet::find($id)->update([
                    'user_id' => $user->id,
                    'pet_values_id' => $petValue->id,
                    'type' => $petItem['type']
                ]);
            };
        }

        return response()->json([
            'message' => 'Pets successfully created',
            'pets' => $pets
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
