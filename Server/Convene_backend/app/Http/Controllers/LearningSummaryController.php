<?php

namespace App\Http\Controllers;

use App\Models\LearningSummary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LearningSummaryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $search = strtolower($request->string('search')->toString());

        $summaries = LearningSummary::query()
            ->with('tutor')
            ->where('user_id', $user->id)
            ->latest('summary_date')
            ->get()
            ->filter(function (LearningSummary $summary) use ($search) {
                if ($search === '') {
                    return true;
                }

                $haystack = strtolower(implode(' ', [
                    $summary->title,
                    $summary->subject,
                    $summary->tutor?->name,
                    implode(' ', $summary->tags ?? []),
                    $summary->overview,
                ]));

                return str_contains($haystack, $search);
            })
            ->values();

        return response()->json([
            'data' => $summaries->map(function (LearningSummary $summary) {
                return [
                    'id' => $summary->id,
                    'title' => $summary->title,
                    'tutorName' => $summary->tutor?->name,
                    'subject' => $summary->subject,
                    'date' => optional($summary->summary_date)?->format('M j, Y'),
                    'tags' => $summary->tags ?? [],
                    'overview' => $summary->overview,
                    'takeaways' => $summary->takeaways ?? [],
                    'actionItems' => $summary->action_items ?? [],
                ];
            })->values(),
        ]);
    }
}
