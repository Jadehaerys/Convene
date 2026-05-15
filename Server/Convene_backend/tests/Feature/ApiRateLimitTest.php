<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiRateLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_is_rate_limited_after_too_many_attempts(): void
    {
        for ($attempt = 0; $attempt < 10; $attempt++) {
            $response = $this->postJson('/api/login', [
                'email' => 'missing@example.com',
                'password' => 'wrong-password',
            ]);

            $response->assertStatus(401);
        }

        $this->postJson('/api/login', [
            'email' => 'missing@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }

    public function test_support_ticket_submission_is_rate_limited(): void
    {
        $user = User::factory()->create([
            'role' => 'student',
        ]);

        Sanctum::actingAs($user);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $response = $this->postJson('/api/support/tickets', [
                'topic' => 'Booking',
                'email' => $user->email,
                'message' => 'Need help with an upcoming consultation session.',
            ]);

            $response->assertCreated();
        }

        $this->postJson('/api/support/tickets', [
            'topic' => 'Booking',
            'email' => $user->email,
            'message' => 'This request should be throttled.',
        ])->assertStatus(429);
    }
}