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
        Schema::create('pet_values', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // For example, 'cow', 'turtle'
            $table->integer('normal')->nullable();
            $table->integer('normal_ride')->nullable();
            $table->integer('normal_fly')->nullable();
            $table->integer('normal_flyride')->nullable();
            $table->integer('neon')->nullable();
            $table->integer('neon_ride')->nullable();
            $table->integer('neon_fly')->nullable();
            $table->integer('neon_flyride')->nullable();
            $table->integer('mega')->nullable();
            $table->integer('mega_ride')->nullable();
            $table->integer('mega_fly')->nullable();
            $table->integer('mega_flyride')->nullable();
            $table->string("image_link")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pet_values');
    }
};
