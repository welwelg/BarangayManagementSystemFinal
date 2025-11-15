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
        Schema::create('disaster_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who reported it
            $table->string('disaster_type');                                  // flood, fire, earthquake, etc.
            $table->text('description');                                      // details of the disaster
            $table->string('location');                                       // where it happened
            $table->dateTime('occurred_at');                                  // when it happened
            $table->enum('status', ['pending', 'in-progress', 'resolved'])->default('pending');
            $table->dateTime('resolved_at')->nullable(); // when it was resolved
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disaster_reports');
    }
};
