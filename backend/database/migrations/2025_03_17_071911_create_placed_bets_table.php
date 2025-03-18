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
        Schema::create('placed_bets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_head');
            $table->unsignedBigInteger('user_tail');
            $table->unsignedBigInteger('head_pet_id');
            $table->unsignedBigInteger('tail_pet_id');
            $table->string('result');
            $table->timestamps();

            $table->foreign('user_head')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('user_tail')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('head_pet_id')->references('id')->on('pets')->onDelete('cascade');
            $table->foreign('tail_pet_id')->references('id')->on('pets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placed_bets');
    }
};
