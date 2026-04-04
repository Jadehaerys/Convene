<?php

namespace App\Http\Controllers;

use App\Models\ConsultationSession;
use App\Models\Tutor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConsultationSessionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $sessions = ConsultationSession::query()
            ->with(['tutor', 'learningSummary'])
            ->where('user_id', $user->id)
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->toString()))
            ->orderByDesc('scheduled_for')
            ->get();

        return response()->json([
            'data' => $sessions->map(fn (ConsultationSession $session) => $this->transformSession($session))->values(),
        ]);
    }

    public function show(Request $request, ConsultationSession $consultationSession): JsonResponse
    {
        abort_unless($consultationSession->user_id === $request->user()->id, 403);

        $consultationSession->load(['tutor', 'learningSummary']);

        return response()->json([
            'data' => array_merge(
                $this->transformSession($consultationSession),
                [
                    'roomCode' => $consultationSession->room_code,
                    'durationMinutes' => $consultationSession->duration_minutes,
                    'notes' => $consultationSession->notes,
                    'participants' => [
                        ['name' => $request->user()->name, 'role' => $request->user()->role, 'status' => 'Connected'],
                        ['name' => $consultationSession->tutor?->name, 'role' => 'tutor', 'status' => 'Connected'],
                    ],
                    'summary' => $consultationSession->learningSummary ? [
                        'id' => $consultationSession->learningSummary->id,
                        'title' => $consultationSession->learningSummary->title,
                    ] : null,
                ]
            ),
        ]);
    }

    public function request(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tutor_id' => ['required', 'exists:tutors,id'],
        ]);

        $tutor = Tutor::findOrFail($validated['tutor_id']);
        $scheduledFor = $tutor->next_available_at ?? now()->addDays(2);

        $session = ConsultationSession::create([
            'user_id' => $request->user()->id,
            'tutor_id' => $tutor->id,
            'subject' => $tutor->subject,
            'status' => 'Upcoming',
            'mode' => $tutor->format,
            'scheduled_for' => $scheduledFor,
            'alternate_slots' => [
                $scheduledFor->copy()->addDay()->format(DATE_ATOM),
                $scheduledFor->copy()->addDays(2)->format(DATE_ATOM),
            ],
            'summary_ready' => false,
            'agenda' => [
                'Confirm learning objective and target outcome',
                'Review a focused concept block',
                'End with next-step recommendations',
            ],
            'prepared' => false,
            'room_code' => 'CNV-'.Str::upper(Str::random(6)),
            'duration_minutes' => 60,
            'notes' => '',
        ]);

        $session->load('tutor');

        return response()->json([
            'message' => 'Consultation request created successfully.',
            'data' => $this->transformSession($session),
        ], 201);
    }

    public function togglePrepared(Request $request, ConsultationSession $consultationSession): JsonResponse
    {
        abort_unless($consultationSession->user_id === $request->user()->id, 403);

        $consultationSession->update([
            'prepared' => !$consultationSession->prepared,
        ]);

        $consultationSession->load(['tutor', 'learningSummary']);

        return response()->json([
            'message' => 'Preparation status updated.',
            'data' => $this->transformSession($consultationSession),
        ]);
    }

    public function rotateSlot(Request $request, ConsultationSession $consultationSession): JsonResponse
    {
        abort_unless($consultationSession->user_id === $request->user()->id, 403);

        $slots = collect([$consultationSession->scheduled_for?->toIso8601String(), ...($consultationSession->alternate_slots ?? [])])
            ->filter()
            ->values();

        if ($slots->count() < 2) {
            return response()->json([
                'message' => 'No alternate slots available.',
                'data' => $this->transformSession($consultationSession),
            ]);
        }

        $current = $consultationSession->scheduled_for?->toIso8601String();
        $currentIndex = $slots->search($current);
        $nextIndex = $currentIndex === false ? 1 : (($currentIndex + 1) % $slots->count());
        $nextSlot = $slots[$nextIndex];

        $remainingAlternates = $slots->reject(fn ($value, $index) => $index === $nextIndex)->values()->all();

        $consultationSession->update([
            'scheduled_for' => $nextSlot,
            'alternate_slots' => $remainingAlternates,
        ]);

        $consultationSession->load(['tutor', 'learningSummary']);

        return response()->json([
            'message' => 'Session slot updated.',
            'data' => $this->transformSession($consultationSession),
        ]);
    }

    public function join(Request $request, ConsultationSession $consultationSession): JsonResponse
    {
        abort_unless($consultationSession->user_id === $request->user()->id, 403);

        $consultationSession->load(['tutor', 'learningSummary']);

        return response()->json([
            'message' => 'Consultation room ready.',
            'data' => [
                'roomCode' => $consultationSession->room_code,
                'meetingState' => $consultationSession->status === 'Upcoming' ? 'Ready to start' : 'Archived session',
                'session' => $this->transformSession($consultationSession),
            ],
        ]);
    }

    public function saveNotes(Request $request, ConsultationSession $consultationSession): JsonResponse
    {
        abort_unless($consultationSession->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $consultationSession->update([
            'notes' => $validated['notes'] ?? '',
        ]);

        return response()->json([
            'message' => 'Consultation notes saved.',
            'data' => [
                'notes' => $consultationSession->notes,
            ],
        ]);
    }

    private function transformSession(ConsultationSession $session): array
    {
        return [
            'id' => $session->id,
            'tutorId' => $session->tutor_id,
            'tutorName' => $session->tutor?->name,
            'subject' => $session->subject,
            'status' => $session->status,
            'mode' => $session->mode,
            'scheduledFor' => optional($session->scheduled_for)?->format('M j, g:i A'),
            'alternateSlots' => collect($session->alternate_slots ?? [])->map(fn ($slot) => date('M j, g:i A', strtotime((string) $slot)))->values()->all(),
            'summaryReady' => $session->summary_ready,
            'agenda' => $session->agenda ?? [],
            'prepared' => $session->prepared,
        ];
    }
}
