<?php

namespace App\Http\Controllers;

use App\Models\Tutor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TutorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tutor::query();

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%")
                    ->orWhereRaw('LOWER(tags) LIKE ?', ['%'.strtolower($search).'%']);
            });
        }

        if ($subject = $request->string('subject')->toString()) {
            if ($subject !== 'All') {
                $query->where('subject', $subject);
            }
        }

        if ($format = $request->string('format')->toString()) {
            if ($format !== 'All') {
                $query->where('format', $format);
            }
        }

        return response()->json([
            'data' => $query->orderByDesc('rating')->get()->map(function (Tutor $tutor) {
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
            })->values(),
            'filters' => [
                'subjects' => array_merge(['All'], Tutor::query()->distinct()->orderBy('subject')->pluck('subject')->all()),
                'formats' => ['All', 'Online', 'Hybrid', 'In person'],
            ],
        ]);
    }
}
