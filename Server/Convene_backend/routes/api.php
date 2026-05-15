<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatBot;
use App\Http\Controllers\ConsultationSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LearningSummaryController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\TutorController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/chat', [ChatBot::class, 'getResponse'])->middleware('throttle:chat');
    Route::get('/dashboard/overview', [DashboardController::class, 'overview']);
    Route::get('/tutors', [TutorController::class, 'index']);
    Route::get('/consultation-sessions', [ConsultationSessionController::class, 'index']);
    Route::post('/consultation-sessions/request', [ConsultationSessionController::class, 'request']);
    Route::get('/consultation-sessions/{consultationSession}', [ConsultationSessionController::class, 'show']);
    Route::patch('/consultation-sessions/{consultationSession}/prepared', [ConsultationSessionController::class, 'togglePrepared']);
    Route::patch('/consultation-sessions/{consultationSession}/rotate-slot', [ConsultationSessionController::class, 'rotateSlot']);
    Route::post('/consultation-sessions/{consultationSession}/join', [ConsultationSessionController::class, 'join']);
    Route::patch('/consultation-sessions/{consultationSession}/notes', [ConsultationSessionController::class, 'saveNotes']);
    Route::get('/learning-summaries', [LearningSummaryController::class, 'index']);
    Route::get('/support/faqs', [SupportController::class, 'faqs']);
    Route::post('/support/tickets', [SupportController::class, 'storeTicket'])->middleware('throttle:support');
});