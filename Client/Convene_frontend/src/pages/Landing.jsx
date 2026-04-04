import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/shared/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  ArrowRightIcon,
  BotIcon,
  CheckCircleIcon,
  CompassIcon,
  FileTextIcon,
  MapPinIcon,
  RatingStars,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from '../components/shared/Icons';
import { tutorCatalog } from '../data/mockData';
import './Landing.css';

const NAV_LINKS = ['Features', 'How It Works', 'For Tutors', 'About'];

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        <path d="M11 8v6M8 11h6"/>
      </svg>
    ),
    tag: 'ai',
    label: 'AI',
    title: 'Smart Tutor Matching',
    desc: 'NLP-powered semantic search reads your learning intent — not just keywords — and ranks the most compatible tutors in real-time.',
    accent: 'blue',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="m9 8 2 2 4-4"/>
      </svg>
    ),
    tag: 'chain',
    label: 'Verified',
    title: 'Verified Credentials',
    desc: 'Every certificate, degree, and teaching record is verified before it appears on the platform.',
    accent: 'teal',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <path d="M8 10h8M8 14h5"/>
      </svg>
    ),
    tag: 'ai',
    label: 'AI',
    title: 'AI Booking Assistant',
    desc: 'An intelligent chatbot handles pre-session FAQs and checks tutor availability in real-time, 24/7.',
    accent: 'blue',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    tag: 'ai',
    label: 'AI',
    title: 'Post-Session Summaries',
    desc: 'AI automatically generates structured session reports — key concepts, action items, and follow-ups. Zero manual notes.',
    accent: 'blue',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    tag: 'chain',
    label: 'Trust',
    title: 'Trusted Ratings',
    desc: "Reviews are moderated for quality and authenticity so learners can rely on educator reputations.",
    accent: 'teal',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    tag: 'default',
    label: 'Platform',
    title: 'Real-Time Booking',
    desc: 'Live availability calendar, instant confirmation, and session reminders. From search to booked in under 2 minutes.',
    accent: 'yellow',
  },
];

const STEPS = [
  { num: '01', title: 'Describe your need', desc: 'Type what you want to learn in plain language. Our NLP engine understands context, not just category tags.' },
  { num: '02', title: 'Get matched', desc: 'AI ranks tutors by semantic fit with your goals. See verified credentials and trusted ratings at a glance.' },
  { num: '03', title: 'Book in seconds', desc: 'Check live availability, chat with the AI assistant for any pre-session questions, and confirm your slot instantly.' },
  { num: '04', title: 'Learn & receive report', desc: 'Attend your session. An AI-generated summary lands in your dashboard automatically — key concepts, no manual notes needed.' },
];

const TICKER_ITEMS = [
  { label: 'Verified profiles', Icon: ShieldCheckIcon },
  { label: 'NLP matching', Icon: SearchIcon },
  { label: 'AI summaries', Icon: FileTextIcon },
  { label: 'Trusted ratings', Icon: StarIcon },
  { label: 'Cebu educators', Icon: CompassIcon },
  { label: 'Credential checks', Icon: CheckCircleIcon },
  { label: 'Smart search', Icon: SparklesIcon },
  { label: 'Live booking', Icon: BotIcon },
];

const ABOUT_VALUES = [
  {
    title: 'Trust built into discovery',
    desc: 'Verification, reviews, and fit signals appear before booking, so students can compare credible options instead of guessing.',
  },
  {
    title: 'AI that reduces admin work',
    desc: 'Search, assistant guidance, and summary generation remove routine friction and leave more time for actual teaching.',
  },
  {
    title: 'Designed for Cebu learning communities',
    desc: 'Convene is shaped around local academic needs, educator visibility, and fast coordination between students and tutors.',
  },
];

const ABOUT_METRICS = [
  { value: '200+', label: 'active tutor profiles' },
  { value: '2 min', label: 'from search to booking intent' },
  { value: '24/7', label: 'assistant guidance availability' },
];

const TUTORS = tutorCatalog.slice(0, 3);

export default function Landing({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stagger hero animations on mount
  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('[data-hero]');
    els?.forEach((el, i) => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.animation = `fadeUp 0.6s var(--ease) forwards`;
        el.style.animationDelay = `${i * 0.12}s`;
      }, 50);
    });
  }, []);

  return (
    <div className="landing">

      {/* ═══════════════════════════════════ NAV ═══ */}
      <header className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="container landing-nav__inner">
          <Logo variant="dark" size="md" />

          <nav className="landing-nav__links">
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`} className="landing-nav__link">
                {l}
              </a>
            ))}
          </nav>

          <div className="landing-nav__cta">
            <Button variant="ghost" size="sm" onClick={onLogin}>Sign in</Button>
              <Button variant="primary" size="sm" onClick={onSignup} iconRight={<ArrowRightIcon size={14} />}>Get started</Button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════ HERO ═══ */}
      <section className="hero" ref={heroRef}>
        {/* Background effects */}
        <div className="hero__bg">
          <div className="hero__grid" />
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__noise" />
        </div>

        <div className="container hero__content">
          <div className="hero__left">
            <div className="hero__badges" data-hero>
              <Badge variant="chain" dot>Verified Educators</Badge>
              <Badge variant="ai" dot>AI Powered</Badge>
            </div>

            <h1 className="hero__title" data-hero>
              Find the right tutor.<br />
              <span className="hero__title-accent">Verified. Instantly.</span>
            </h1>

            <p className="hero__sub" data-hero>
              Convene is an AI-powered consultation platform for students and educators in Cebu — built to eliminate search friction and learning loss.
            </p>

            <div className="hero__actions" data-hero>
              <Button variant="primary" size="lg" onClick={onSignup} iconRight={<ArrowRightIcon size={16} />}>
                Start for free
              </Button>
              <Button variant="secondary" size="lg" onClick={onLogin}>
                Sign in to Convene
              </Button>
            </div>

            <div className="hero__proof" data-hero>
              <div className="hero__avatars">
                {['MS','JR','AL','KD'].map((i,idx) => (
                  <div key={idx} className="hero__avatar">{i}</div>
                ))}
              </div>
              <div className="hero__proof-text">
                <strong>200+ tutors</strong> active in Cebu
              </div>
            </div>
          </div>

          <div className="hero__right" data-hero>
            <HeroCard tutors={TUTORS} />
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════ TICKER ═══ */}
      <div className="ticker">
        <div className="ticker__track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map(({ label, Icon }, i) => (
            <span className="ticker__item" key={`${label}-${i}`}>
              <Icon size={14} />
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════ FEATURES ═══ */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Platform capabilities</p>
            <h2 className="display-lg">
              The future of learning,<br />
              <span className="gradient-yellow">built for real outcomes.</span>
            </h2>
            <p className="section-sub">
              Every feature is purpose-built to solve a real problem in academic consultation — from discovery to post-session retention.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className={`feature-card feature-card--${f.accent}`} key={i}>
                <div className="feature-card__icon">{f.icon}</div>
                <Badge variant={f.tag}>{f.label}</Badge>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ HOW IT WORKS ═══ */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Simple process</p>
            <h2 className="display-lg">From search to session<br />in under 2 minutes.</h2>
          </div>

          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div className="step" key={s.num}>
                <div className="step__num">{s.num}</div>
                <div className="step__connector" />
                <h3 className="step__title">{s.title}</h3>
                <p className="step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="container about-section__grid">
          <div className="about-section__copy">
            <p className="section-eyebrow">Why Convene</p>
            <h2 className="display-lg">Built for trust, speed, and better follow-through.</h2>
            <p className="section-sub">
              Convene is not just a directory. It is a learning workflow that helps students discover the right educator, book faster, and retain more after every consultation.
            </p>

            <div className="about-section__values">
              {ABOUT_VALUES.map((value) => (
                <article className="about-card" key={value.title}>
                  <div className="about-card__icon">
                    <CheckCircleIcon size={18} />
                  </div>
                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="about-section__stats">
            {ABOUT_METRICS.map((metric) => (
              <article className="about-stat" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ TUTORS PREVIEW ═══ */}
      <section className="tutors-section" id="for-tutors">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Live platform</p>
            <h2 className="display-lg">Meet verified educators.</h2>
            <p className="section-sub">Every rating and credential is reviewed for quality so what you see is reliable.</p>
          </div>

          <div className="tutors-grid">
            {TUTORS.map((t, i) => (
              <TutorCard key={i} tutor={t} onBook={onSignup} />
            ))}
          </div>

          <div className="tutors-cta">
            <Button variant="outline" size="md" onClick={onSignup} iconRight={<ArrowRightIcon size={15} />}>Browse all tutors</Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ CTA ═══ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-glow" />
            <Badge variant="yellow" dot>For Cebu students & educators</Badge>
            <h2 className="display-md" style={{ marginTop: '20px', maxWidth: '540px' }}>
              Ready to learn without limits?
            </h2>
            <p className="cta-sub">
              Join the platform that puts AI to work for your education.
            </p>
            <div className="cta-buttons">
              <Button variant="primary" size="lg" onClick={onSignup}>Create free account</Button>
              <Button variant="ghost" size="lg" onClick={onLogin}>Sign in</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="container landing-footer__inner">
          <div className="landing-footer__brand">
            <Logo variant="dark" size="sm" />
            <p className="landing-footer__tagline">AI Education Platform</p>
            <p className="landing-footer__loc">
              <MapPinIcon size={14} />
              <span>Cebu and Naga City, Philippines</span>
            </p>
          </div>
          <div className="landing-footer__links">
            <Link to="/privacy" className="landing-footer__link">Privacy Policy</Link>
            <Link to="/terms" className="landing-footer__link">Terms of Service</Link>
            <Link to="/contact" className="landing-footer__link">Contact</Link>
          </div>
          <p className="landing-footer__copy">© 2026 Convene. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

/* ── Sub-components ── */

function HeroCard({ tutors }) {
  const featuredTutor = tutors[0];

  return (
    <div className="hero-card-stack">
      <div className="hero-card hero-card--main">
        <div className="hero-card__header">
          <div className="hero-card__avatar">
            {featuredTutor.initials}
            <span className="hero-card__verified">
              <CheckCircleIcon size={11} />
            </span>
          </div>
          <div>
            <div className="hero-card__name">{featuredTutor.name}</div>
            <div className="hero-card__subject">{featuredTutor.subject}</div>
          </div>
          <Badge variant="chain" size="sm">Verified</Badge>
        </div>

        <div className="hero-card__tags">
          {featuredTutor.tags.map((tag) => (
            <span className="hero-card__tag" key={tag}>{tag}</span>
          ))}
        </div>

        <div className="hero-card__rating">
          <RatingStars value={5} size={13} className="hero-card__stars" />
          <span className="hero-card__rating-val">{featuredTutor.rating}</span>
          <span className="hero-card__reviews">({featuredTutor.reviews} reviews)</span>
        </div>
      </div>

      <div className="hero-card hero-card--ai">
        <div className="hero-card__ai-icon">
          <BotIcon size={18} />
        </div>
        <div>
          <div className="hero-card__ai-label">AI fit score</div>
          <div className="hero-card__ai-bar">
            <div className="hero-card__ai-fill" />
          </div>
          <div className="hero-card__ai-score">94% match for calculus support</div>
        </div>
      </div>

      <div className="hero-card hero-card--summary">
        <div className="hero-card__summary-icon">
          <FileTextIcon size={18} />
        </div>
        <div>
          <div className="hero-card__summary-label">Session summary ready</div>
          <div className="hero-card__summary-sub">Action items and key takeaways generated automatically</div>
        </div>
      </div>
    </div>
  );
}

function TutorCard({ tutor, onBook }) {
  return (
    <div className="tutor-card">
      <div className="tutor-card__header">
        <div className="tutor-card__avatar">{tutor.initials}</div>
        <div className="tutor-card__info">
          <div className="tutor-card__name">{tutor.name}</div>
          <div className="tutor-card__subject">{tutor.subject}</div>
        </div>
        {tutor.verified && <Badge variant="chain" size="sm">Verified</Badge>}
      </div>

      <div className="tutor-card__tags">
        {tutor.tags.map(t => (
          <span className="tutor-card__tag" key={t}>{t}</span>
        ))}
      </div>

      <div className="tutor-card__footer">
        <div className="tutor-card__rating">
          <RatingStars value={5} size={13} className="tutor-card__stars" />
          <span className="tutor-card__val">{tutor.rating}</span>
          <span className="tutor-card__reviews">({tutor.reviews})</span>
        </div>
        <Button variant="outline" size="sm" iconRight={<ArrowRightIcon size={14} />} onClick={onBook}>Book</Button>
      </div>
    </div>
  );
}