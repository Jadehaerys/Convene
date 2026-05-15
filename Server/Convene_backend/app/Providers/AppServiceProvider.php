<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth', function (Request $request) {
            $email = strtolower((string) $request->input('email', 'guest'));

            return Limit::perMinute(10)->by($email.'|'.$request->ip());
        });

        RateLimiter::for('chat', function (Request $request) {
            $key = $request->user()?->id ?? $request->ip();

            return Limit::perMinute(30)->by('chat|'.$key);
        });

        RateLimiter::for('support', function (Request $request) {
            $key = $request->user()?->id ?? strtolower((string) $request->input('email', $request->ip()));

            return Limit::perMinute(5)->by('support|'.$key);
        });
    }
}
