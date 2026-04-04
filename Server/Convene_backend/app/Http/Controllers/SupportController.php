<?php

namespace App\Http\Controllers;

use App\Models\FaqEntry;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function faqs(Request $request): JsonResponse
    {
        $search = strtolower($request->string('search')->toString());

        $faqs = FaqEntry::query()
            ->orderBy('sort_order')
            ->get()
            ->filter(function (FaqEntry $entry) use ($search) {
                if ($search === '') {
                    return true;
                }

                $haystack = strtolower("{$entry->category} {$entry->question} {$entry->answer}");

                return str_contains($haystack, $search);
            })
            ->values();

        return response()->json([
            'data' => $faqs->map(fn (FaqEntry $entry) => [
                'id' => $entry->id,
                'category' => $entry->category,
                'question' => $entry->question,
                'answer' => $entry->answer,
            ])->values(),
        ]);
    }

    public function storeTicket(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'topic' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $ticket = SupportTicket::create([
            'user_id' => $request->user()->id,
            'topic' => $validated['topic'],
            'email' => $validated['email'],
            'message' => $validated['message'],
            'status' => 'Open',
        ]);

        return response()->json([
            'message' => 'Support request submitted successfully.',
            'data' => [
                'id' => $ticket->id,
                'topic' => $ticket->topic,
                'status' => $ticket->status,
                'email' => $ticket->email,
                'message' => $ticket->message,
                'createdAt' => $ticket->created_at?->toIso8601String(),
            ],
        ], 201);
    }
}
