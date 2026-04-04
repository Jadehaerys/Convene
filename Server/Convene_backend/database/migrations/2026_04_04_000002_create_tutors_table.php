<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tutors', function (Blueprint $table) {
            $table->id();
            $table->string('initials', 8);
            $table->string('name');
            $table->string('subject');
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->boolean('verified')->default(false);
            $table->json('tags')->nullable();
            $table->string('format');
            $table->unsignedInteger('price_per_session');
            $table->dateTime('next_available_at')->nullable();
            $table->string('response_time')->nullable();
            $table->text('bio');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutors');
    }
};
