<?php

namespace App\Http\Controllers;

use App\Models\PetValue;
use Illuminate\Http\Request;

class PetValueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PetValue::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'normal' => 'nullable|integer',
            'normal_ride' => 'nullable|integer',
            'normal_fly' => 'nullable|integer',
            'normal_flyride' => 'nullable|integer',
            'neon' => 'nullable|integer',
            'neon_ride' => 'nullable|integer',
            'neon_fly' => 'nullable|integer',
            'neon_flyride' => 'nullable|integer',
            'mega' => 'nullable|integer',
            'mega_ride' => 'nullable|integer',
            'mega_fly' => 'nullable|integer',
            'mega_flyride' => 'nullable|integer',
        ]);


        $PetValue = PetValue::create($fields);

        return [
            'message' => 'Successfully Created',
            'petvalue' => $PetValue
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return PetValue::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'normal' => 'nullable|integer',
            'normal_ride' => 'nullable|integer',
            'normal_fly' => 'nullable|integer',
            'normal_flyride' => 'nullable|integer',
            'neon' => 'nullable|integer',
            'neon_ride' => 'nullable|integer',
            'neon_fly' => 'nullable|integer',
            'neon_flyride' => 'nullable|integer',
            'mega' => 'nullable|integer',
            'mega_ride' => 'nullable|integer',
            'mega_fly' => 'nullable|integer',
            'mega_flyride' => 'nullable|integer',
        ]);


        PetValue::find($id)->update($fields);

        return [
            'message' => 'Successfully Updated',
            'petvalue' => PetValue::find($id)  // Directly return the updated model instance
        ];
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        PetValue::find($id)->delete();

        return ['message' => "PetValue was deleted"];
    }
}
