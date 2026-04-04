import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/shared/DashboardShell';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  ArrowRightIcon,
  CalendarIcon,
  CompassIcon,
  FileTextIcon,
  MessageSquareIcon,
  RatingStars,
  SearchIcon,
  SparklesIcon,
} from '../components/shared/Icons';
import { getDashboardOverview, getStoredUser } from '../lib/api';
import './Dashboard.css';
import './Portal.css';

export default function Dashboard({ role = 'student', onLogout }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [overview, setOverview] = useState({ stats: [], featured_tutors: [], upcoming_sessions: [], recent_summaries: [] });
  const [loadError, setLoadError] = useState('');
  const effectiveRole = (getStoredUser()?.role || role || 'student').toLowerCase();
  const isStudent = effectiveRole === 'student';

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      try {
        const response = await getDashboardOverview();
        if (isMounted) {
          setOverview(response);
        }
      } catch (error) {
        if (error.status === 401) {
          onLogout?.();
          return;
        }

        if (isMounted) {
          setLoadError('Could not load the dashboard overview right now.');
        }
      }
    };

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, [onLogout]);

  const matches = overview.featured_tutors.filter((tutor) => (
    !query || [tutor.name, tutor.subject, tutor.tags.join(' '), tutor.bio].join(' ').toLowerCase().includes(query.toLowerCase())
  ));

  const handleDiscover = () => {
    navigate('/dashboard/tutors', { state: { query } });
  };

  return (
    <DashboardShell
      title={isStudent ? 'Learning command center' : 'Educator command center'}
      subtitle={isStudent ? 'Move from discovery to booked sessions without losing momentum.' : 'Monitor demand, sessions, and learner follow-through from one place.'}
      onLogout={onLogout}
      role={effectiveRole}
      actions={
        <Button variant="outline" size="sm" icon={<CompassIcon size={15} />} onClick={() => navigate('/dashboard/tutors')}>
          Browse tutors
        </Button>
      }
    >
      <div className="overview-page">
        {loadError && <div className="portal-banner">{loadError}</div>}
        <section className="overview-stats">
          {overview.stats.map((item) => (
            <article className="overview-stat" key={item.label}>
              <div className="overview-stat__value">{item.value}</div>
              <div className="overview-stat__label">{item.label}</div>
              <div className="overview-stat__detail">{item.detail}</div>
            </article>
          ))}
        </section>

        <section className="overview-search-card">
          <div className="overview-search-card__header">
            <div>
              <Badge variant="ai" dot>
                Smart matching
              </Badge>
              <h2 className="overview-search-card__title">Describe what you need help with</h2>
            </div>
            <span className="overview-search-card__hint">Search updates in real time as you type.</span>
          </div>

          <div className="overview-search-card__input-row">
            <label className="overview-search-input">
              <SearchIcon size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Example: I need help with integration by parts and timed problem solving"
              />
            </label>
            <Button variant="primary" size="md" iconRight={<ArrowRightIcon size={15} />} onClick={handleDiscover}>
              Explore matches
            </Button>
          </div>

          <div className="overview-result-list">
            {matches.map((tutor) => (
              <button key={tutor.id} type="button" className="overview-result" onClick={() => navigate('/dashboard/tutors', { state: { query: tutor.subject } })}>
                <div className="overview-result__avatar">{tutor.initials}</div>
                <div className="overview-result__copy">
                  <strong>{tutor.name}</strong>
                  <span>{tutor.subject} · {tutor.format}</span>
                </div>
                <div className="overview-result__rating">
                  <RatingStars value={5} size={12} className="overview-result__stars" />
                  <span>{tutor.rating}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="overview-grid-two">
          <article className="overview-mini-card">
            <div className="overview-mini-card__header">
              <Badge variant="chain" size="sm">Upcoming</Badge>
              <CalendarIcon size={16} />
            </div>
            <h3>Next sessions</h3>
            <div className="overview-mini-list">
              {overview.upcoming_sessions.map((session) => (
                <div className="overview-mini-list__item" key={session.id}>
                  <strong>{session.subject}</strong>
                  <span>{session.tutorName}</span>
                  <small>{session.scheduledFor}</small>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/sessions')}>
              Open session planner
            </Button>
          </article>

          <article className="overview-mini-card">
            <div className="overview-mini-card__header">
              <Badge variant="yellow" size="sm">Latest</Badge>
              <FileTextIcon size={16} />
            </div>
            <h3>Recent summaries</h3>
            <div className="overview-mini-list">
              {overview.recent_summaries.map((summary) => (
                <div className="overview-mini-list__item" key={summary.id}>
                  <strong>{summary.title}</strong>
                  <span>{summary.tutorName}</span>
                  <small>{summary.date}</small>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/summaries')}>
              Review summaries
            </Button>
          </article>
        </section>

        <section className="overview-action-grid">
          <button type="button" className="overview-action-card" onClick={() => navigate('/dashboard/tutors')}>
            <CompassIcon size={18} />
            <div>
              <strong>Discover tutors</strong>
              <span>Filter by subject, schedule fit, and verified reputation.</span>
            </div>
          </button>

          <button type="button" className="overview-action-card" onClick={() => navigate('/dashboard/sessions')}>
            <SparklesIcon size={18} />
            <div>
              <strong>Plan upcoming work</strong>
              <span>Rotate alternate slots and mark session prep complete.</span>
            </div>
          </button>

          <button type="button" className="overview-action-card" onClick={() => navigate('/dashboard/support')}>
            <MessageSquareIcon size={18} />
            <div>
              <strong>Route support faster</strong>
              <span>Search help topics and structure support requests cleanly.</span>
            </div>
          </button>
        </section>
      </div>
    </DashboardShell>
  );
}