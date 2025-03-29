<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetValue;
use App\Models\PlacedBet;
use App\Models\User;
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
     * Player 1 creates a bet and chooses a side.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'user_head' => 'nullable',
            'user_tail' => 'nullable',
            'head_pet_ids' => 'nullable|array', // Array of pet IDs for head
            'tail_pet_ids' => 'nullable|array', // Array of pet IDs for tail
            'isActive' => 'boolean',
            'result' => 'nullable',
        ]);

        // Player 1 chooses a side (head or tail)
        if ($request->has('user_head')) {
            $fields['user_head'] = $request->user_head;
        } elseif ($request->has('user_tail')) {
            $fields['user_tail'] = $request->user_tail;
        } else {
            return response()->json([
                'error' => 'Player 1 must choose a side (head or tail).'
            ], 400);
        }

        // Check if the pet IDs belong to the user
        $user = User::find($fields['user_head'] ?? $fields['user_tail']);
        if (!$user) {
            return response()->json([
                'error' => 'User not found.'
            ], 404);
        }

        // Validate head pet IDs
        if ($request->has('head_pet_ids')) {
            $userPetIds = $user->pets()->where('in_bet', false)->pluck('id')->toArray();
            $invalidHeadPets = array_diff($request->head_pet_ids, $userPetIds);

            if (!empty($invalidHeadPets)) {
                return response()->json([
                    'error' => 'The following head pet IDs are either not yours or already in a bet: ' . implode(', ', $invalidHeadPets),
                ], 400);
            }
        }

        // Validate tail pet IDs
        if ($request->has('tail_pet_ids')) {
            $userPetIds = $user->pets()->where('in_bet', false)->pluck('id')->toArray();
            $invalidTailPets = array_diff($request->tail_pet_ids, $userPetIds);

            if (!empty($invalidTailPets)) {
                return response()->json([
                    'error' => 'The following tail pet IDs are either not yours or already in a bet: ' . implode(', ', $invalidTailPets),
                ], 400);
            }
        }

        if (
            ($request->has('head_pet_ids') && count($request->head_pet_ids) > 10) ||
            ($request->has('tail_pet_ids') && count($request->tail_pet_ids) > 10)
        ) {
            return response()->json([
                'error' => 'You can only bet up to 10 pets per side.'
            ], 400);
        }


        // Create the bet
        $bet = PlacedBet::create($fields);

        // Associate pets with the bet
        if ($request->has('head_pet_ids')) {
            foreach ($request->head_pet_ids as $petId) {
                $bet->pets()->create([
                    'pet_id' => $petId,
                    'side' => 'head',
                ]);
                $bettedPet = Pet::find($petId);
                if ($bettedPet) {
                    $bettedPet->update(['in_bet' => true]);
                }

            }
        }

        if ($request->has('tail_pet_ids')) {
            foreach ($request->tail_pet_ids as $petId) {
                $bet->pets()->create([
                    'pet_id' => $petId,
                    'side' => 'tail',
                ]);
                $bettedPet = Pet::find($petId);
                if ($bettedPet) {
                    $bettedPet->update(['in_bet' => true]);
                }

            }
        }

        return response()->json([
            'message' => 'Bet created successfully. Waiting for player 2 to join.',
            'bet' => $bet->load('pets'), // Load the associated pets
            'betId' => $bet->id
        ], 201);
    }

    /**
     * Player 2 joins the bet by choosing the remaining side.
     */
    public function joinBet(Request $request, string $id)
    {
        $bet = PlacedBet::find($id);
        if (!$bet) {
            return response()->json([
                'error' => 'Bet not found.'
            ], 404);
        }

        // Check if the bet already has both players
        if ($bet->user_head && $bet->user_tail) {
            return response()->json([
                'error' => 'This bet already has two players.'
            ], 400);
        }

        if (
            ($request->has('head_pet_ids') && count($request->head_pet_ids) > 10) ||
            ($request->has('tail_pet_ids') && count($request->tail_pet_ids) > 10)
        ) {
            return response()->json([
                'error' => 'You can only bet up to 10 pets per side.'
            ], 400);
        }


        // Validate the request
        $fields = $request->validate([
            'user_head' => 'nullable',
            'user_tail' => 'nullable',
            'head_pet_ids' => 'nullable|array',
            'tail_pet_ids' => 'nullable|array',
            'result' => 'nullable',
        ]);

        // Determine which side the player is joining
        $joiningHead = $bet->user_tail && !$bet->user_head;
        $joiningTail = $bet->user_head && !$bet->user_tail;

        // Validate the joining request
        if ($joiningHead) {
            if (!$request->has('user_head') || !$request->has('head_pet_ids')) {
                return response()->json([
                    'error' => 'Player 2 must choose the head side and provide pet IDs.'
                ], 400);
            }
            $newUserField = 'user_head';
            $newPetIds = $request->head_pet_ids;
            $newSide = 'head';
            $existingSide = 'tail';
        } elseif ($joiningTail) {
            if (!$request->has('user_tail') || !$request->has('tail_pet_ids')) {
                return response()->json([
                    'error' => 'Player 2 must choose the tail side and provide pet IDs.'
                ], 400);
            }
            $newUserField = 'user_tail';
            $newPetIds = $request->tail_pet_ids;
            $newSide = 'tail';
            $existingSide = 'head';
        } else {
            return response()->json([
                'error' => 'Invalid bet state.'
            ], 400);
        }

        // Calculate the value of existing pets
        $existingPets = $bet->pets()->where('side', $existingSide)->get();
        $existingTotalValue = $existingPets->sum(function ($pet) {
            return $pet->pet->petValue->{$pet->pet->type};
        });

        // Calculate the value of the new pets without creating them yet
        $newTotalValue = 0;
        foreach ($newPetIds as $petId) {
            $pet = Pet::find($petId);
            if (!$pet) {
                return response()->json([
                    'error' => 'Pet with ID ' . $petId . ' not found.'
                ], 404);
            }
            $newTotalValue += $pet->petValue->{$pet->type};
        }

        // Check if the pet values are within the acceptable range
        if ($newTotalValue < $existingTotalValue - 5 || $newTotalValue > $existingTotalValue + 5) {
            return response()->json([
                'error' => 'Invalid range for pet values. Bet cannot be completed.'
            ], 400);
        }

        // Update the bet
        $bet->update([
            $newUserField => $request->{$newUserField},
            'isActive' => false,
            'result' => $request->result,
        ]);

        // Associate pets with the bet
        foreach ($newPetIds as $petId) {
            $bet->pets()->create([
                'pet_id' => $petId,
                'side' => $newSide,
            ]);
        }

        // Determine the winner and transfer pets
        if ($bet->result === 'head') {
            $winnerId = $bet->user_head;
            $loserId = $bet->user_tail;
            $winnerSide = 'head';
            $loserSide = 'tail';
        } elseif ($bet->result === 'tail') {
            $winnerId = $bet->user_tail;
            $loserId = $bet->user_head;
            $winnerSide = 'tail';
            $loserSide = 'head';
        } else {
            return response()->json([
                'error' => 'Invalid result.'
            ], 400);
        }

        // Transfer pets from the loser to the winner
        $loserPets = $bet->pets()->where('side', $loserSide)->get();
        foreach ($loserPets as $pet) {
            // Update the pet's owner to the winner
            Pet::where('id', $pet->pet_id)->update([
                'user_id' => $winnerId,
            ]);
        }

        return response()->json([
            'message' => 'Player 2 has joined the bet successfully. Pets have been transferred to the winner.',
            'bet' => $bet->load('pets'),
            'betId' => $bet->id
        ], 200);
    }


    public function showIsActive()
    {
        // Fetch all active bets with their associated users and pets
        $bets = PlacedBet::with(['userHead', 'userTail', 'pets.pet.petValue'])
            ->where('isActive', true)
            ->get();

        // Iterate over each bet in the collection
        $bets->each(function ($bet) {
            // Get all head pets for this bet
            $headPets = $bet->pets->where('side', 'head');
            $bet->head_pets = $headPets->map(function ($pet) {
                return [
                    'id' => $pet->pet->id,
                    'name' => $pet->pet->petValue->name,
                    'type' => $pet->pet->type,
                    'value' => $pet->pet->petValue->{$pet->pet->type},
                ];
            });

            // Calculate the total value of head pets
            $bet->head_total_value = $headPets->sum(function ($pet) {
                return $pet->pet->petValue->{$pet->pet->type};
            });

            // Get all tail pets for this bet
            $tailPets = $bet->pets->where('side', 'tail');
            $bet->tail_pets = $tailPets->map(function ($pet) {
                return [
                    'id' => $pet->pet->id,
                    'name' => $pet->pet->petValue->name,
                    'type' => $pet->pet->type,
                    'value' => $pet->pet->petValue->{$pet->pet->type},
                ];
            });

            // Calculate the total value of tail pets
            $bet->tail_total_value = $tailPets->sum(function ($pet) {
                return $pet->pet->petValue->{$pet->pet->type};
            });
        });

        return response()->json([
            'message' => 'Showing all active bets',
            'bet' => $bets,
        ], 200);
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
    public function destroy($id)
    {
        $bet = PlacedBet::with('pets')->find($id);

        if (!$bet) {
            return response()->json(['error' => 'Bet not found.'], 404);
        }

        // Reset all associated pets' in_bet status to false
        foreach ($bet->pets as $betPet) {
            $pet = Pet::find($betPet->pet_id);
            if ($pet) {
                $pet->update(['in_bet' => false]);
            }
        }

        // Delete the bet and related bet_pet entries if needed
        $bet->pets()->delete(); // assuming this is the bet_pet records
        $bet->delete();

        return response()->json(['message' => 'Bet and related pets successfully cleared.'], 200);
    }

}
