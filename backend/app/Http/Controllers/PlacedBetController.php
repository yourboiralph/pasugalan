<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetValue;
use App\Models\PlacedBet;
use Illuminate\Http\Request;

class PlacedBetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PlacedBet::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'user_head' => 'required',
            'user_tail' => 'required',
            'head_pet_id' => 'required',
            'tail_pet_id' => 'required',
            'result' => 'required',
        ]);

        $user_head_type = Pet::find($request->head_pet_id)->type;
        $user_head_value = Pet::find($request->head_pet_id)->petValue->{$user_head_type};

        $user_tail_type = Pet::find($request->tail_pet_id)->type;
        $user_tail_value = Pet::find($request->tail_pet_id)->petValue->{$user_tail_type};

        // Check if the tail value is within the acceptable range of ±2 of the head value
        if ($user_tail_value >= $user_head_value - 0.5 && $user_tail_value <= $user_head_value + 0.5) {
            $bet = PlacedBet::create($fields);

            if($request->result === 'head'){
                Pet::find($request->tail_pet_id)->update([
                    'user_id' => $request->user_head
                ]);

                return response()->json([
                    'message' => 'Bet transaction successful',
                    'bet' => $bet
                ], 201);
            }elseif($request->result === 'tail'){
                Pet::find($request->head_pet_id)->update([
                    'user_id' => $request->user_tail
                ]);
                return response()->json([
                    'message' => 'Bet transaction successful',
                    'bet' => $bet
                ], 201);
            }
        } else {
            return [
                'error' => "Invalid Range for both values"
            ];
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return PlacedBet::find($id);
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
