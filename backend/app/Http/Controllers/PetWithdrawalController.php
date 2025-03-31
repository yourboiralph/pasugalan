<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;

class PetWithdrawalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $fields = $request->validate([
            'roblox_username' => 'required|string',
            'pet_data' => 'required|array',
            'pet_data.*' => 'integer|distinct'
        ]);

        foreach($fields['pet_data'] as $petItem){
            Pet::find($petItem)->update([
                'in_withdraw' => true
            ]);
        }

        return response()->json([
            'message' => 'Pets successfully in withdraw'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
