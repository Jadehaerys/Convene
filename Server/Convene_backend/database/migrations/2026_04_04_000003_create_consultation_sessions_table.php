<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultation_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tutor_id')->constrained()->cascadeOnDelete();
            $table->string('subject');
            $table->string('status')->default('Upcoming');
            $table->string('mode');
            $table->dateTime('scheduled_for');
            $table->json('alternate_slots')->nullable();
            $table->boolean('summary_ready')->default(false);
            $table->json('agenda')->nullable();
            $table->boolean('prepared')->default(false);
            $table->string('room_code')->nullable();
            $table->unsignedInteger('duration_minutes')->default(60);
            $table->longText('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultation_sessions');
    }
};
