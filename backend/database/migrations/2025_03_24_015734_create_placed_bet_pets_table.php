<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('placed_bet_pets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('placed_bet_id');
            $table->unsignedBigInteger('pet_id');
            $table->enum('side', ['head', 'tail']); // Specify whether the pet is on the head or tail side
            $table->timestamps();

            $table->foreign('placed_bet_id')->references('id')->on('placed_bets')->onDelete('cascade');
            $table->foreign('pet_id')->references('id')->on('pets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placed_bet_pets');
    }
};
