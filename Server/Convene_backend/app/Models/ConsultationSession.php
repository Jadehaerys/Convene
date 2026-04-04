<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ConsultationSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tutor_id',
        'subject',
        'status',
        'mode',
        'scheduled_for',
        'alternate_slots',
        'summary_ready',
        'agenda',
        'prepared',
        'room_code',
        'duration_minutes',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_for' => 'datetime',
            'alternate_slots' => 'array',
            'summary_ready' => 'boolean',
            'agenda' => 'array',
            'prepared' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(Tutor::class);
    }

    public function learningSummary(): HasOne
    {
        return $this->hasOne(LearningSummary::class);
    }
}
