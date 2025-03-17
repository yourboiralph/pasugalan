<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    // NO REGISTER... ROBLOX AUTH :D

    public function login(Request $request){
        $fields = $request->validate([
            'phrase' => 'required',
            'username' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if(!$user){
            $user = User::create($fields);
        }

        // SHOULD BE RANDOMIZED
        $DESC_KEY = $request->phrase;

        $response = Http::post('https://users.roblox.com/v1/usernames/users', [
            "usernames" => [$request->username],
            "excludeBannedUsers" => false
        ]);

        if($response->successful()){
            $RBLX_ID = $response->json()['data'][0]['id'];
        }

        $response = Http::get('https://users.roblox.com/v1/users/' . $RBLX_ID);

        if($response->successful()){
            $RBLX_DESC = $response->json()['description'];
        }

        if($RBLX_DESC !== $DESC_KEY){
            return [
                'error' => 'Invalid description'
            ];
        }

        $token = $user->createToken($user->username);

        // Set expiration time to 5 hours from now
        $token->accessToken->expires_at = now()->addHours(3);

        return [
            'user' => $user,
            'token' => $token->plainTextToken
        ];
    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();

        return [
            'message' => 'Successfully logged out'
        ];
    }
}
