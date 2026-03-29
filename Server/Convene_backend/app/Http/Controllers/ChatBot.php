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
        // Call the OpenRouter API
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
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
            return response()->json(['error' => 'Failed to get response from OpenAI'], 500);
        }
    }
}
