<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatBot extends Controller
{
    public function getResponse(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $message = $request->input('message');
        $apiKey = env('OPENROUTER_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'reply' => $this->fallbackReply($message),
            ]);
        }

        // Call the OpenRouter API
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
        ])->post('https://openrouter.ai/api/v1/chat/completions', [
            'model' => 'openai/gpt-4o-mini',
            'messages' => [
                ['role' => 'user', 'content' => $message],
            ],
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return response()->json(['reply' => $data['choices'][0]['message']['content']]);
        } else {
            return response()->json(['reply' => $this->fallbackReply($message)]);
        }
    }

    private function fallbackReply(string $message): string
    {
        $normalized = strtolower($message);

        if (str_contains($normalized, 'session') || str_contains($normalized, 'schedule')) {
            return 'You can review upcoming consultations in the sessions page, rotate through alternate slots, and open the consultation room when you are ready.';
        }

        if (str_contains($normalized, 'summary') || str_contains($normalized, 'notes')) {
            return 'Open the summaries page to review key takeaways and copy the next-action list into your study workflow.';
        }

        if (str_contains($normalized, 'tutor') || str_contains($normalized, 'match')) {
            return 'Use the tutor discovery page to filter by subject, format, and search intent, then send a consultation request directly from the shortlist.';
        }

        return 'I can help you with tutor discovery, consultation scheduling, summaries, and support tickets. Tell me which workflow you want to move through.';
    }
}
