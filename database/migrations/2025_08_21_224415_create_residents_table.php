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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('middle_name', 20)->nullable();
            $table->string('last_name');
            $table->string('suffix', 10)->nullable();
            $table->integer('age');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('zone');
            $table->string('household_no', 50);
            $table->string('contact_no', 11);
            $table->string('email')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
