<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningSummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'consultation_session_id',
        'tutor_id',
        'title',
        'subject',
        'summary_date',
        'tags',
        'overview',
        'takeaways',
        'action_items',
    ];

    protected function casts(): array
    {
        return [
            'summary_date' => 'date',
            'tags' => 'array',
            'takeaways' => 'array',
            'action_items' => 'array',
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

    public function consultationSession(): BelongsTo
    {
        return $this->belongsTo(ConsultationSession::class);
    }
}
