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
            $table->unsignedBigInteger('user_head')->nullable();
            $table->unsignedBigInteger('user_tail')->nullable();
            $table->boolean('isActive')->default(true);
            $table->string('result')->nullable();
            $table->timestamps();

            $table->foreign('user_head')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('user_tail')->references('id')->on('users')->onDelete('cascade');
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
