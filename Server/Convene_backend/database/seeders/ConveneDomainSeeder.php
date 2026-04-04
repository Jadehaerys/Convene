<?php

namespace Database\Seeders;

use App\Models\ConsultationSession;
use App\Models\FaqEntry;
use App\Models\LearningSummary;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class ConveneDomainSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::query()->updateOrCreate(
            ['email' => 'student@convene.local'],
            [
                'name' => 'Mika Ramos',
                'role' => 'student',
                'password' => Hash::make('password123'),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'educator@convene.local'],
            [
                'name' => 'Lea Navarro',
                'role' => 'tutor',
                'password' => Hash::make('password123'),
            ]
        );

        $tutorData = [
            [
                'initials' => 'MS',
                'name' => 'Maria Santos',
                'subject' => 'Mathematics',
                'rating' => 4.97,
                'reviews_count' => 184,
                'verified' => true,
                'tags' => ['Calculus', 'Algebra', 'Exam prep'],
                'format' => 'Online',
                'price_per_session' => 900,
                'next_available_at' => Carbon::parse('2026-04-06 18:30:00'),
                'response_time' => 'Usually replies in 12 minutes',
                'bio' => 'Breaks advanced topics into clean, step-by-step explanations for students preparing for board exams and major assessments.',
            ],
            [
                'initials' => 'JR',
                'name' => 'Juan Reyes',
                'subject' => 'Computer Science',
                'rating' => 4.93,
                'reviews_count' => 127,
                'verified' => true,
                'tags' => ['Python', 'Algorithms', 'Machine learning'],
                'format' => 'Hybrid',
                'price_per_session' => 1100,
                'next_available_at' => Carbon::parse('2026-04-07 16:00:00'),
                'response_time' => 'Usually replies in 18 minutes',
                'bio' => 'Ideal for students who need project mentoring, coding interview prep, or a stronger grasp of data structures.',
            ],
            [
                'initials' => 'AL',
                'name' => 'Ana Lim',
                'subject' => 'Physics',
                'rating' => 4.89,
                'reviews_count' => 98,
                'verified' => true,
                'tags' => ['Mechanics', 'Thermodynamics', 'Problem solving'],
                'format' => 'Online',
                'price_per_session' => 950,
                'next_available_at' => Carbon::parse('2026-04-08 19:15:00'),
                'response_time' => 'Usually replies in 25 minutes',
                'bio' => 'Focuses on intuition first, then applies formal problem solving so concepts stay usable during exams.',
            ],
            [
                'initials' => 'KD',
                'name' => 'Kevin Dizon',
                'subject' => 'Writing & Research',
                'rating' => 4.91,
                'reviews_count' => 76,
                'verified' => true,
                'tags' => ['Thesis', 'Citations', 'Editing'],
                'format' => 'In person',
                'price_per_session' => 850,
                'next_available_at' => Carbon::parse('2026-04-09 13:30:00'),
                'response_time' => 'Usually replies in 32 minutes',
                'bio' => 'Supports capstone and thesis work with a practical workflow for drafting, revising, and defending your ideas.',
            ],
            [
                'initials' => 'LN',
                'name' => 'Lea Navarro',
                'subject' => 'Chemistry',
                'rating' => 4.88,
                'reviews_count' => 88,
                'verified' => true,
                'tags' => ['Organic', 'General chem', 'Lab reports'],
                'format' => 'Hybrid',
                'price_per_session' => 980,
                'next_available_at' => Carbon::parse('2026-04-10 17:45:00'),
                'response_time' => 'Usually replies in 21 minutes',
                'bio' => 'Strong fit for students who need help moving from memorization to reaction patterns and lab-ready understanding.',
            ],
            [
                'initials' => 'PG',
                'name' => 'Paolo Garcia',
                'subject' => 'Business Analytics',
                'rating' => 4.90,
                'reviews_count' => 64,
                'verified' => true,
                'tags' => ['Excel', 'Forecasting', 'Dashboards'],
                'format' => 'Online',
                'price_per_session' => 1050,
                'next_available_at' => Carbon::parse('2026-04-11 20:00:00'),
                'response_time' => 'Usually replies in 15 minutes',
                'bio' => 'Helps students turn raw coursework into decision-ready analysis with clear models, dashboards, and presentation flow.',
            ],
        ];

        $tutors = collect($tutorData)->map(function (array $attributes) {
            return Tutor::query()->updateOrCreate(
                ['name' => $attributes['name']],
                $attributes,
            );
        })->keyBy('name');

        $sessionOne = ConsultationSession::query()->updateOrCreate(
            ['user_id' => $student->id, 'tutor_id' => $tutors['Maria Santos']->id, 'subject' => 'Integral Calculus'],
            [
                'status' => 'Upcoming',
                'mode' => 'Online',
                'scheduled_for' => Carbon::parse('2026-04-06 18:30:00'),
                'alternate_slots' => [
                    Carbon::parse('2026-04-07 17:30:00')->toIso8601String(),
                    Carbon::parse('2026-04-08 19:00:00')->toIso8601String(),
                ],
                'summary_ready' => false,
                'agenda' => ['Review substitution techniques', 'Practice two timed problems'],
                'prepared' => false,
                'room_code' => 'CNV-CALC01',
                'duration_minutes' => 60,
                'notes' => 'Focus on exam pacing and error patterns.',
            ]
        );

        $sessionTwo = ConsultationSession::query()->updateOrCreate(
            ['user_id' => $student->id, 'tutor_id' => $tutors['Juan Reyes']->id, 'subject' => 'Python Data Structures'],
            [
                'status' => 'Upcoming',
                'mode' => 'Hybrid',
                'scheduled_for' => Carbon::parse('2026-04-07 16:00:00'),
                'alternate_slots' => [
                    Carbon::parse('2026-04-08 15:30:00')->toIso8601String(),
                    Carbon::parse('2026-04-09 18:15:00')->toIso8601String(),
                ],
                'summary_ready' => true,
                'agenda' => ['Compare lists and dictionaries', 'Refactor one coding exercise'],
                'prepared' => true,
                'room_code' => 'CNV-CODE02',
                'duration_minutes' => 60,
                'notes' => 'Bring the inventory script for live review.',
            ]
        );

        $sessionThree = ConsultationSession::query()->updateOrCreate(
            ['user_id' => $student->id, 'tutor_id' => $tutors['Ana Lim']->id, 'subject' => 'Kinematics Review'],
            [
                'status' => 'Completed',
                'mode' => 'Online',
                'scheduled_for' => Carbon::parse('2026-04-01 19:15:00'),
                'alternate_slots' => [Carbon::parse('2026-04-03 19:15:00')->toIso8601String()],
                'summary_ready' => true,
                'agenda' => ['Velocity-time graph interpretation', 'Word problem review'],
                'prepared' => true,
                'room_code' => 'CNV-PHY03',
                'duration_minutes' => 60,
                'notes' => 'Review the last two motion problems without notes.',
            ]
        );

        $sessionFour = ConsultationSession::query()->updateOrCreate(
            ['user_id' => $student->id, 'tutor_id' => $tutors['Kevin Dizon']->id, 'subject' => 'Thesis Chapter 2'],
            [
                'status' => 'Completed',
                'mode' => 'In person',
                'scheduled_for' => Carbon::parse('2026-03-28 14:00:00'),
                'alternate_slots' => [Carbon::parse('2026-03-29 10:00:00')->toIso8601String()],
                'summary_ready' => true,
                'agenda' => ['Narrow related literature', 'Fix citation structure'],
                'prepared' => true,
                'room_code' => 'CNV-RES04',
                'duration_minutes' => 60,
                'notes' => 'Rework citation structure before next adviser review.',
            ]
        );

        $summaryData = [
            [
                'session' => $sessionOne,
                'tutor' => $tutors['Maria Santos'],
                'title' => 'Integration by Parts',
                'subject' => 'Calculus',
                'summary_date' => '2026-04-01',
                'tags' => ['Calculus', 'Techniques', 'Timed practice'],
                'overview' => 'You focused on identifying when integration by parts is more efficient than substitution and practiced choosing u and dv with less hesitation.',
                'takeaways' => [
                    'Prioritize logarithmic and inverse trigonometric terms for u when possible.',
                    'Check if repeated integration by parts actually simplifies before committing.',
                    'Use a mini table setup for polynomial-trigonometric products to save time.',
                ],
                'action_items' => [
                    'Complete four integration-by-parts items under a 20-minute timer.',
                    'Write a one-page decision guide for substitution versus integration by parts.',
                    'Flag any steps where sign errors still happen and review them next session.',
                ],
            ],
            [
                'session' => $sessionTwo,
                'tutor' => $tutors['Juan Reyes'],
                'title' => 'Python Collections Review',
                'subject' => 'Computer Science',
                'summary_date' => '2026-03-30',
                'tags' => ['Python', 'Data structures', 'Refactoring'],
                'overview' => 'The session centered on choosing the right collection type and rewriting repetitive loops into clearer, more Pythonic operations.',
                'takeaways' => [
                    'Use dictionaries when lookup speed matters more than ordering semantics.',
                    'Set operations help reduce duplicate filtering boilerplate.',
                    'Readable iteration often matters more than squeezing logic into one line.',
                ],
                'action_items' => [
                    'Refactor the inventory script using dictionary aggregation.',
                    'Write one example each for list, tuple, set, and dictionary tradeoffs.',
                    'Prepare a question on nested structures for the next session.',
                ],
            ],
            [
                'session' => $sessionThree,
                'tutor' => $tutors['Ana Lim'],
                'title' => 'Physics Problem Decomposition',
                'subject' => 'Physics',
                'summary_date' => '2026-03-27',
                'tags' => ['Physics', 'Problem solving', 'Exam prep'],
                'overview' => 'You practiced slowing down on multi-step problems so the diagram, known values, and target variable are clear before solving.',
                'takeaways' => [
                    'Separating knowns, unknowns, and assumptions reduces algebra mistakes.',
                    'Free-body sketches made the biggest difference in the last two items.',
                    'You solved time-based graph interpretation faster after labeling axes explicitly.',
                ],
                'action_items' => [
                    'Redo the last two motion problems without checking notes.',
                    'Keep a one-page list of formulas grouped by motion type.',
                    'Bring one graph-heavy question to the next meeting.',
                ],
            ],
        ];

        foreach ($summaryData as $summary) {
            LearningSummary::query()->updateOrCreate(
                ['consultation_session_id' => $summary['session']->id],
                [
                    'user_id' => $student->id,
                    'tutor_id' => $summary['tutor']->id,
                    'title' => $summary['title'],
                    'subject' => $summary['subject'],
                    'summary_date' => $summary['summary_date'],
                    'tags' => $summary['tags'],
                    'overview' => $summary['overview'],
                    'takeaways' => $summary['takeaways'],
                    'action_items' => $summary['action_items'],
                ]
            );
        }

        $faqData = [
            ['category' => 'Matching', 'question' => 'How does Convene rank tutors?', 'answer' => 'The platform combines your search intent, subject focus, availability overlap, verified credentials, and recent learner feedback to produce a ranked shortlist.'],
            ['category' => 'Booking', 'question' => 'Can I reschedule a session after it is confirmed?', 'answer' => 'Yes. Upcoming sessions can be moved into alternate slots if the tutor has availability.'],
            ['category' => 'Summaries', 'question' => 'What is included in an AI summary?', 'answer' => 'Each summary captures the core concept review, main takeaways, and concrete next actions so you can continue studying without rebuilding the session from memory.'],
            ['category' => 'Trust', 'question' => 'How are tutors verified?', 'answer' => 'Profiles are checked before publishing. Credentials, history, and rating signals are reviewed so learners can see who is verified at a glance.'],
            ['category' => 'Support', 'question' => 'Where should I report an issue with a session?', 'answer' => 'Use the support form in the dashboard to submit a booking, profile, or summary issue.'],
        ];

        foreach ($faqData as $index => $faq) {
            FaqEntry::query()->updateOrCreate(
                ['question' => $faq['question']],
                [
                    'category' => $faq['category'],
                    'answer' => $faq['answer'],
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}
