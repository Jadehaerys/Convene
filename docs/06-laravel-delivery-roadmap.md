# Convene Laravel Delivery Roadmap

Last updated: May 15, 2026

## Purpose

This document translates the current Convene MVP into a deployable Laravel-first plan.

It is written for the current stack:

- frontend on Vercel
- Laravel API kept as the backend
- relational database backing the product

## Recommended Production Stack

- Frontend: Vite/React deployed to Vercel
- Backend API: Laravel 12 deployed outside Vercel on Render, Fly.io, or Railway
- Database: PostgreSQL on Supabase or Neon
- Auth: Laravel Sanctum with personal access tokens for the current split frontend/backend setup
- Queue: database queue first, Redis later if AI and notifications become heavier
- Storage: S3-compatible object storage when tutor documents or uploads are introduced
- Realtime/video: LiveKit, Daily, or Jitsi when the consultation room becomes a real call experience

### Why PostgreSQL

- The domain is strongly relational: users, tutor profiles, requests, sessions, summaries, reviews, tickets.
- Laravel supports PostgreSQL cleanly with Eloquent and migrations.
- PostgreSQL gives a better path for JSONB fields, full-text search, and possible vector search later.
- Supabase and Neon are low-friction hosted options for personal projects.

## Important Deployment Decision

If you are keeping Laravel, use Vercel for the frontend only.

Laravel can be made to run in serverless environments, but for this project it is a worse default than hosting the API separately. The simplest low-cost architecture is:

1. Vercel serves the React frontend.
2. Laravel serves the API from a separate host.
3. PostgreSQL is shared by Laravel in production.

## Current State Summary

- Student-facing flows exist and mostly work with seeded data.
- Tutor login exists, but tutor-owned workflows are not modeled deeply yet.
- Tutor records are separate from user accounts.
- Creating a consultation request immediately creates a scheduled session.
- The consultation room is still a structured workflow, not a real media experience.
- The AI summary generation shown in the UI is simulated.
- General API coverage exists, but policies, rate limiting, CI, and meaningful feature tests are still thin.

## Main Product Flows

### Student flow

1. Register or log in.
2. Open dashboard overview.
3. Search and filter tutors.
4. Submit a consultation request with a learning goal and preferred slots.
5. Receive accept, decline, or reschedule feedback from a tutor.
6. Join the session room.
7. Save notes during the session.
8. Review the summary after the session.
9. Submit a support ticket if something fails.

### Tutor flow

1. Register as a tutor.
2. Complete a tutor profile.
3. Publish availability.
4. Review consultation requests.
5. Accept, decline, or propose another slot.
6. Join the session room.
7. Add notes or validate the summary.
8. Review ratings and support issues.

### Support flow

1. Search FAQs.
2. Submit a ticket.
3. Review ticket status.
4. Resolve or close the issue.

## Phase Roadmap

### Phase 0: Deployable foundation

Priority: P0

This is the minimum foundation before a public MVP.

- Remove or disable unsupported UI actions:
  - fake Google auth buttons
  - fake forgot password flow
  - fake AI summary generation button
  - placeholder contact channels if they are not real
- Add backend hardening:
  - form request validation classes
  - policies and role middleware
  - route rate limiting for auth, chat, and support submission
  - pagination on list endpoints
  - consistent JSON response envelopes
- Improve environment readiness:
  - production PostgreSQL configuration
  - documented frontend and backend env variables
  - allowed frontend origin and CORS setup
- Add feature tests for:
  - auth
  - tutors
  - consultation requests or sessions
  - summaries
  - support

Exit criteria:

- frontend build passes
- backend feature tests cover the core student path
- unsupported flows are no longer misleading
- staging deploy runs on PostgreSQL

### Phase 1: Two-sided booking model

Priority: P1

- Add tutor profiles linked directly to user accounts.
- Split consultation requests from consultation sessions.
- Add tutor availability slots.
- Add tutor actions to accept, decline, and reschedule requests.
- Add tutor-specific dashboard data.

Exit criteria:

- students create requests, not instant sessions
- tutors can manage inbound requests
- session creation happens only after request acceptance

### Phase 2: Real session lifecycle

Priority: P1

- Replace the fake room state with a real provider integration.
- Track join timestamps and actual lifecycle status.
- Support author-owned notes with visibility rules.
- Add attendance and no-show states.

Exit criteria:

- room state reflects real provider state
- both student and tutor can join with correct access control
- completed, cancelled, and no-show states are persisted

### Phase 3: Real summaries and reviews

Priority: P2

- Queue AI summary jobs.
- Add summary status tracking.
- Allow tutor or student review of generated output.
- Add session review and rating submission.

Exit criteria:

- summary generation is asynchronous and observable
- summary failures are visible in the UI
- review data can be queried for tutor reputation

### Phase 4: Operations and moderation

Priority: P2

- Add tutor verification workflow.
- Add support queue management.
- Add moderation and admin tools.
- Add analytics and abuse monitoring.

## Minimum Backend Changes Before Deployment

If the immediate goal is to launch a public MVP while keeping Laravel, this is the smallest realistic backend change list:

1. Keep the current Sanctum token approach, but add role middleware and policies.
2. Add rate limiting for `/api/register`, `/api/login`, `/api/chat`, and `/api/support/tickets`.
3. Add pagination to tutors, sessions, and summaries list endpoints.
4. Standardize API responses with resources or a shared response format.
5. Move production configuration to PostgreSQL now.
6. Add feature tests before public deployment.
7. Stop presenting fake summary generation and fake auth flows as finished product features.

## Target Data Model

The model below is the recommended target, not the required first migration set.

### Core auth and profiles

#### `users`

- id
- name
- email
- email_verified_at
- role: `student`, `tutor`, `admin`
- status: `active`, `suspended`
- password
- timezone
- avatar_path
- last_seen_at
- timestamps

#### `tutor_profiles`

- id
- user_id unique fk `users`
- headline
- bio
- verification_status: `pending`, `verified`, `rejected`
- hourly_rate
- formats jsonb
- response_time_minutes
- average_rating
- reviews_count
- is_listed
- next_available_at
- timestamps

#### `tutor_subjects`

- id
- tutor_profile_id
- subject_name
- tags jsonb
- timestamps

#### `tutor_availability_slots`

- id
- tutor_profile_id
- starts_at
- ends_at
- mode
- status: `open`, `held`, `booked`, `blocked`
- timestamps

### Booking and session lifecycle

#### `consultation_requests`

- id
- student_user_id fk `users`
- tutor_profile_id fk `tutor_profiles`
- subject
- learning_goal
- requested_mode
- status: `pending`, `accepted`, `declined`, `reschedule_proposed`, `cancelled`, `expired`
- accepted_at nullable
- declined_at nullable
- cancelled_at nullable
- notes_to_tutor nullable
- timestamps

#### `consultation_request_slots`

- id
- consultation_request_id
- starts_at
- ends_at
- rank
- timestamps

#### `consultation_sessions`

- id
- consultation_request_id nullable
- student_user_id fk `users`
- tutor_profile_id fk `tutor_profiles`
- subject
- mode
- status: `scheduled`, `live`, `completed`, `cancelled`, `no_show`
- scheduled_start_at
- scheduled_end_at
- room_provider nullable
- room_reference nullable
- joined_student_at nullable
- joined_tutor_at nullable
- prepared_by_student boolean
- prepared_by_tutor boolean
- timestamps

#### `session_notes`

- id
- consultation_session_id
- author_user_id
- visibility: `private`, `shared`
- content
- timestamps

### Summaries and reviews

#### `learning_summaries`

- id
- consultation_session_id unique
- tutor_profile_id
- student_user_id
- status: `pending`, `processing`, `ready`, `failed`
- title
- overview
- takeaways jsonb
- action_items jsonb
- generated_by: `ai`, `tutor`, `manual`
- generated_at nullable
- timestamps

#### `session_reviews`

- id
- consultation_session_id unique
- student_user_id
- tutor_profile_id
- rating
- comment nullable
- timestamps

### Support and operations

#### `support_tickets`

- id
- user_id nullable
- topic
- category
- status: `open`, `in_progress`, `resolved`, `closed`
- priority: `low`, `normal`, `high`
- email
- message
- resolution_note nullable
- timestamps

#### `faq_entries`

- id
- category
- question
- answer
- sort_order
- is_published
- timestamps

## Migration Strategy From the Current Schema

1. Add `tutor_profiles` linked to `users`.
2. Backfill tutor users where possible from current tutor records.
3. Add `consultation_requests` without removing current sessions yet.
4. Add new `tutor_profile_id` foreign keys beside current `tutor_id` keys.
5. Backfill session and summary relationships.
6. Add `session_notes` and migrate the current notes field later.
7. Remove legacy tutor references only after the API cutover is complete.

## API Contract

This contract keeps Laravel controllers resource-oriented while still allowing targeted workflow actions.

### Auth

#### `POST /api/auth/register`

Request

```json
{
  "name": "Mika Ramos",
  "email": "mika@example.com",
  "password": "secret123!",
  "password_confirmation": "secret123!",
  "role": "student"
}
```

Response `201`

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Mika Ramos",
      "email": "mika@example.com",
      "role": "student"
    },
    "token": "plain_text_token"
  }
}
```

#### `POST /api/auth/login`

Request

```json
{
  "email": "mika@example.com",
  "password": "secret123!"
}
```

#### `POST /api/auth/logout`

#### `GET /api/me`

### Tutor discovery and tutor profile

#### `GET /api/tutors`

Query params

- `search`
- `subject`
- `format`
- `verified`
- `page`

Response `200`

```json
{
  "data": [
    {
      "id": 12,
      "name": "Maria Santos",
      "headline": "Calculus and board exam coach",
      "subject_names": ["Mathematics"],
      "formats": ["online"],
      "verification_status": "verified",
      "average_rating": 4.97,
      "reviews_count": 184,
      "next_available_at": "2026-05-18T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 4,
    "total": 64
  },
  "filters": {
    "subjects": ["Mathematics", "Physics"],
    "formats": ["online", "hybrid", "in_person"]
  }
}
```

#### `GET /api/tutors/{tutor}`

#### `GET /api/tutor/profile`

#### `PUT /api/tutor/profile`

#### `POST /api/tutor/availability`

#### `DELETE /api/tutor/availability/{slot}`

### Consultation requests

#### `POST /api/consultation-requests`

Request

```json
{
  "tutor_profile_id": 12,
  "subject": "Integral Calculus",
  "learning_goal": "Need help with substitution and integration by parts",
  "requested_mode": "online",
  "candidate_slots": [
    "2026-05-18T10:00:00Z",
    "2026-05-18T13:00:00Z"
  ],
  "notes_to_tutor": "I am preparing for finals."
}
```

Response `201`

```json
{
  "data": {
    "id": 44,
    "status": "pending"
  },
  "message": "Consultation request created."
}
```

#### `GET /api/consultation-requests`

Query params

- `status`
- `role`
- `page`

#### `GET /api/consultation-requests/{request}`

#### `PATCH /api/consultation-requests/{request}/accept`

#### `PATCH /api/consultation-requests/{request}/decline`

#### `PATCH /api/consultation-requests/{request}/propose-slots`

#### `POST /api/consultation-requests/{request}/cancel`

### Sessions

#### `GET /api/sessions`

Query params

- `status`
- `page`

#### `GET /api/sessions/{session}`

Response `200`

```json
{
  "data": {
    "id": 88,
    "subject": "Integral Calculus",
    "status": "scheduled",
    "mode": "online",
    "scheduled_start_at": "2026-05-18T10:00:00Z",
    "scheduled_end_at": "2026-05-18T11:00:00Z",
    "student": {
      "id": 1,
      "name": "Mika Ramos"
    },
    "tutor": {
      "id": 12,
      "name": "Maria Santos"
    },
    "room": {
      "provider": "internal_stub",
      "reference": "CNV-ABC123",
      "join_state": "ready"
    },
    "prepared_by_student": true,
    "prepared_by_tutor": false
  }
}
```

#### `POST /api/sessions/{session}/join`

#### `PATCH /api/sessions/{session}/prepared`

#### `PUT /api/sessions/{session}/notes/shared`

#### `PUT /api/sessions/{session}/notes/private`

#### `POST /api/sessions/{session}/complete`

#### `POST /api/sessions/{session}/cancel`

### Summaries

#### `GET /api/summaries`

Query params

- `search`
- `status`
- `page`

#### `GET /api/summaries/{summary}`

#### `POST /api/sessions/{session}/summary-jobs`

Response `202`

```json
{
  "data": {
    "session_id": 88,
    "status": "processing"
  },
  "message": "Summary generation queued."
}
```

### Support

#### `GET /api/support/faqs`

#### `POST /api/support/tickets`

#### `GET /api/support/tickets`

#### `GET /api/support/tickets/{ticket}`

### Assistant

#### `POST /api/chat`

Use this endpoint only for general assistant help. Do not make it the real session messaging channel or the summary generation pipeline.

## Laravel Implementation Notes

- Use form request classes for create and update actions.
- Use policies instead of repeated inline ownership checks.
- Use API resources for stable response envelopes.
- Use enums or centralized constant maps for statuses.
- Queue AI calls instead of blocking request cycles.
- Prefer paginated resources over raw full collections.
- Keep `auth:sanctum`, but decide explicitly whether production will stay on bearer tokens or move to SPA cookie auth later.

## First Implementation Slice To Build Next

1. Add policies, rate limits, and feature tests.
2. Remove or relabel fake UI actions.
3. Introduce `consultation_requests`.
4. Introduce `tutor_profiles` tied to `users`.
5. Move production config to PostgreSQL and deploy a staging environment.