# Convene Collaboration Handoff

Last updated: April 4, 2026

## Purpose

This file is a working guide for collaborators joining the current Convene codebase.

It covers:

- what was added in the latest implementation pass
- what is already working
- what still needs to be built
- how to run the project locally
- which accounts and routes are available for testing

## Project Structure

- Frontend: `Client/Convene_frontend`
- Backend: `Server/Convene_backend`
- Product/flow diagrams: `docs/01-system-architecture.png`, `docs/02-student-journey.png`, `docs/03-tutor-onboarding.png`, `docs/04-postsession-flow.png`

## What Was Added Today

### Frontend

- Expanded dashboard routing beyond the initial placeholder screen
- Added protected pages for:
  - tutor discovery
  - session planner
  - AI summaries
  - support center
  - virtual consultation room
- Replaced emoji-based UI affordances with reusable SVG icons
- Added a shared dashboard shell and a reusable frontend API client
- Connected the frontend to real Laravel endpoints instead of local mock-only flows
- Added public informational pages for privacy, terms, and contact
- Added persistence for shortlist and support form drafts using local storage

### Backend

- Added Laravel domain models for:
  - tutors
  - consultation sessions
  - learning summaries
  - FAQ entries
  - support tickets
- Added role support on users (`student`, `tutor`)
- Added seed data for tutors, sessions, summaries, FAQs, and demo accounts
- Added new authenticated API routes for dashboard data and consultation workflows
- Added a safer chatbot fallback when `OPENROUTER_API_KEY` is not configured
- Updated logout so Sanctum token logout works properly

## Current Working Features

The following were implemented and verified against the live backend:

- user registration with role
- user login with Sanctum token
- dashboard overview API
- tutor discovery API with filtering
- consultation request creation
- session prepared toggle
- session slot rotation
- consultation room join flow
- consultation notes save flow
- learning summaries fetch
- support FAQ fetch
- support ticket submission

## Current Frontend Routes

### Public

- `/`
- `/login`
- `/signup`
- `/privacy`
- `/terms`
- `/contact`

### Protected

- `/dashboard`
- `/dashboard/tutors`
- `/dashboard/sessions`
- `/dashboard/summaries`
- `/dashboard/support`
- `/dashboard/sessions/:sessionId/room`

## Current Backend API Routes

### Auth

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/user`

### Product data

- `GET /api/dashboard/overview`
- `GET /api/tutors`
- `GET /api/learning-summaries`
- `GET /api/support/faqs`
- `POST /api/support/tickets`

### Consultation sessions

- `GET /api/consultation-sessions`
- `POST /api/consultation-sessions/request`
- `GET /api/consultation-sessions/{id}`
- `POST /api/consultation-sessions/{id}/join`
- `PATCH /api/consultation-sessions/{id}/prepared`
- `PATCH /api/consultation-sessions/{id}/rotate-slot`
- `PATCH /api/consultation-sessions/{id}/notes`

### Assistant

- `POST /api/chat`

## Local Setup Guide

### Backend

Work inside `Server/Convene_backend`.

Recommended commands:

```powershell
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Important notes:

- The backend currently uses MySQL from `.env`
- Current `.env` values expect:
  - `DB_CONNECTION=mysql`
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=3307`
  - `DB_DATABASE=convene_backend`
  - `DB_USERNAME=root`
  - `DB_PASSWORD=`
- If MySQL on port `3307` is not available on another machine, collaborators must either:
  - update `.env` to match their local MySQL setup, or
  - switch the backend to sqlite for local-only development

### Frontend

Work inside `Client/Convene_frontend`.

Recommended commands:

```powershell
npm install
npm run dev
```

Build verification command:

```powershell
npm run build
```

Important notes:

- Do not run `npm install` from the workspace root
- Run frontend commands only inside `Client/Convene_frontend`
- The frontend falls back to `http://localhost:8000` if `VITE_API_URL` is not set
- Recommended frontend env value for consistency:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Seeded Test Accounts

- Student account:
  - email: `student@convene.local`
  - password: `password123`
- Educator account:
  - email: `educator@convene.local`
  - password: `password123`

## Important Implementation Notes

- The consultation room is currently a structured product flow, not a real video-call implementation
- The room supports:
  - room entry
  - room metadata
  - agenda display
  - local in-session notes persistence to backend
  - lightweight in-room chat UI
- The consultation room does not yet provide:
  - WebRTC audio/video streaming
  - screen sharing
  - participant mute/camera controls with real media state
  - recording

- Tutor discovery now uses real backend data instead of static frontend mocks
- Dashboard overview now uses the backend overview endpoint
- Summaries and support pages now use real API requests
- Support form submissions now create database records
- Chat endpoint now falls back gracefully if OpenRouter is not configured

## Missing or Still Needed

These are the main remaining gaps.

### High priority

- Real-time video/audio for the consultation room
- Real tutor-side dashboard behavior and tutor-owned data flows
- Authorization rules and policies for stronger access control
- Better validation and error UX in the frontend
- Proper environment documentation for teammate setup

### Product/backend gaps

- No bookings approval/decline workflow for tutors yet
- No admin area or moderation tools
- No notification system for session changes
- No real calendar sync
- No actual ratings/reviews submission flow yet
- No file upload support for tutor credentials or documents yet
- No attendance tracking or session completion workflow beyond seeded state

### Auth/security gaps

- No password reset flow
- No email verification flow
- No Google auth despite the UI button
- No rate limiting strategy documented for public auth endpoints
- No formal role policy/middleware separation beyond stored role value

### Infrastructure gaps

- No deployment guide yet
- No CI pipeline documented
- No dedicated frontend `.env.example` for API configuration
- No explicit local database bootstrap guide for new collaborators

### Testing gaps

- API tests are still missing for the new domain endpoints
- Frontend integration tests are still missing
- No end-to-end automated flow tests for login, tutor request, and consultation room entry

## Suggested Next Work Items

If the team continues from this state, these are the strongest next tasks:

1. Implement real video conferencing using WebRTC, LiveKit, or Jitsi
2. Add tutor-facing session management and request approval flows
3. Add API feature tests for tutors, sessions, summaries, and support
4. Add frontend loading/error/skeleton states more consistently
5. Add admin and moderation capabilities
6. Replace fake Google auth button with real OAuth or remove it temporarily

## Files Touched in the Latest Pass

This is not a complete git diff, but these are the main areas changed.

### Frontend

- `Client/Convene_frontend/src/App.jsx`
- `Client/Convene_frontend/src/lib/api.js`
- `Client/Convene_frontend/src/components/shared/Icons.jsx`
- `Client/Convene_frontend/src/components/shared/DashboardShell.jsx`
- `Client/Convene_frontend/src/pages/Dashboard.jsx`
- `Client/Convene_frontend/src/pages/Tutors.jsx`
- `Client/Convene_frontend/src/pages/Sessions.jsx`
- `Client/Convene_frontend/src/pages/Summaries.jsx`
- `Client/Convene_frontend/src/pages/Support.jsx`
- `Client/Convene_frontend/src/pages/ConsultationRoom.jsx`

### Backend

- `Server/Convene_backend/routes/api.php`
- `Server/Convene_backend/app/Http/Controllers/AuthController.php`
- `Server/Convene_backend/app/Http/Controllers/ChatBot.php`
- `Server/Convene_backend/app/Http/Controllers/DashboardController.php`
- `Server/Convene_backend/app/Http/Controllers/TutorController.php`
- `Server/Convene_backend/app/Http/Controllers/ConsultationSessionController.php`
- `Server/Convene_backend/app/Http/Controllers/LearningSummaryController.php`
- `Server/Convene_backend/app/Http/Controllers/SupportController.php`
- `Server/Convene_backend/app/Models/*`
- `Server/Convene_backend/database/migrations/*`
- `Server/Convene_backend/database/seeders/ConveneDomainSeeder.php`

## Final Notes for Collaborators

- Use the seeded accounts first before creating new users
- Verify backend is running before testing frontend authenticated flows
- If login works but dashboard data fails, check `VITE_API_URL` and backend port first
- If backend commands fail on another machine, check `.env`, MySQL availability, and app key configuration before changing application code
