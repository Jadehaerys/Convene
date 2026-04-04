<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tutor extends Model
{
    use HasFactory;

    protected $fillable = [
        'initials',
        'name',
        'subject',
        'rating',
        'reviews_count',
        'verified',
        'tags',
        'format',
        'price_per_session',
        'next_available_at',
        'response_time',
        'bio',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:2',
            'verified' => 'boolean',
            'tags' => 'array',
            'next_available_at' => 'datetime',
        ];
    }

    public function consultationSessions(): HasMany
    {
        return $this->hasMany(ConsultationSession::class);
    }

    public function learningSummaries(): HasMany
    {
        return $this->hasMany(LearningSummary::class);
    }
}
