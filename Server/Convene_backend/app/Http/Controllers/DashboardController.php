<?php

namespace App\Http\Controllers;

use App\Models\ConsultationSession;
use App\Models\LearningSummary;
use App\Models\Tutor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $user = $request->user();

        $stats = [
            [
                'label' => 'Matched tutors',
                'value' => (string) Tutor::count(),
                'detail' => 'Available to review and request',
            ],
            [
                'label' => 'Upcoming sessions',
                'value' => (string) ConsultationSession::where('user_id', $user->id)->where('status', 'Upcoming')->count(),
                'detail' => 'Across your current study plan',
            ],
            [
                'label' => 'Summary archive',
                'value' => (string) LearningSummary::where('user_id', $user->id)->count(),
                'detail' => 'Available for review and copy',
            ],
        ];

        if ($user->role === 'tutor') {
            $stats = [
                [
                    'label' => 'Weekly bookings',
                    'value' => '14',
                    'detail' => 'Two more than last week',
                ],
                [
                    'label' => 'Average rating',
                    'value' => '4.96',
                    'detail' => 'Across recent verified reviews',
                ],
                [
                    'label' => 'Response rate',
                    'value' => '98%',
                    'detail' => 'Strong inquiry turnaround',
                ],
            ];
        }

        return response()->json([
            'stats' => $stats,
            'featured_tutors' => Tutor::query()->orderByDesc('rating')->limit(3)->get()->map(fn (Tutor $tutor) => $this->transformTutor($tutor))->values(),
            'upcoming_sessions' => ConsultationSession::query()
                ->with('tutor')
                ->where('user_id', $user->id)
                ->where('status', 'Upcoming')
                ->orderBy('scheduled_for')
                ->limit(2)
                ->get()
                ->map(fn (ConsultationSession $session) => $this->transformSession($session))
                ->values(),
            'recent_summaries' => LearningSummary::query()
                ->with('tutor')
                ->where('user_id', $user->id)
                ->latest('summary_date')
                ->limit(2)
                ->get()
                ->map(fn (LearningSummary $summary) => $this->transformSummary($summary))
                ->values(),
        ]);
    }

    private function transformTutor(Tutor $tutor): array
    {
        return [
            'id' => $tutor->id,
            'initials' => $tutor->initials,
            'name' => $tutor->name,
            'subject' => $tutor->subject,
            'rating' => (float) $tutor->rating,
            'reviews' => $tutor->reviews_count,
            'verified' => $tutor->verified,
            'tags' => $tutor->tags ?? [],
            'format' => $tutor->format,
            'price' => 'PHP '.number_format($tutor->price_per_session).' / session',
            'availability' => optional($tutor->next_available_at)?->format('M j, g:i A'),
            'responseTime' => $tutor->response_time,
            'bio' => $tutor->bio,
        ];
    }

    private function transformSession(ConsultationSession $session): array
    {
        return [
            'id' => $session->id,
            'subject' => $session->subject,
            'tutorName' => $session->tutor?->name,
            'scheduledFor' => optional($session->scheduled_for)?->format('M j, g:i A'),
        ];
    }

    private function transformSummary(LearningSummary $summary): array
    {
        return [
            'id' => $summary->id,
            'title' => $summary->title,
            'tutorName' => $summary->tutor?->name,
            'date' => optional($summary->summary_date)?->format('M j, Y'),
        ];
    }
}
