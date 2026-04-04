import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardShell from '../components/shared/DashboardShell';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ArrowRightIcon, ClockIcon, CompassIcon, FilterIcon, RatingStars, SearchIcon, ShieldCheckIcon } from '../components/shared/Icons';
import { getTutors, requestConsultation } from '../lib/api';
import './Portal.css';

export default function Tutors({ onLogout }) {
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.query || '');
  const [subject, setSubject] = useState('All');
  const [format, setFormat] = useState('All');
  const [shortlist, setShortlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('convene_shortlist') || '[]');
    } catch {
      return [];
    }
  });
  const [requestMessage, setRequestMessage] = useState('');
  const [tutors, setTutors] = useState([]);
  const [filters, setFilters] = useState({ subjects: ['All'], formats: ['All', 'Online', 'Hybrid', 'In person'] });
  const [loadError, setLoadError] = useState('');

  const shortlistedTutors = tutors.filter((tutor) => shortlist.includes(tutor.id));

  useEffect(() => {
    localStorage.setItem('convene_shortlist', JSON.stringify(shortlist));
  }, [shortlist]);

  useEffect(() => {
    let isMounted = true;

    const loadTutors = async () => {
      try {
        const response = await getTutors({ search: query, subject, format });
        if (isMounted) {
          setTutors(response.data || []);
          setFilters(response.filters || { subjects: ['All'], formats: ['All', 'Online', 'Hybrid', 'In person'] });
          setLoadError('');
        }
      } catch (error) {
        if (error.status === 401) {
          onLogout?.();
          return;
        }

        if (isMounted) {
          setLoadError('Could not load tutor recommendations right now.');
        }
      }
    };

    loadTutors();

    return () => {
      isMounted = false;
    };
  }, [format, onLogout, query, subject]);

  useEffect(() => {
    if (!requestMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setRequestMessage(''), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [requestMessage]);

  const toggleShortlist = (tutorId) => {
    setShortlist((previous) => (
      previous.includes(tutorId)
        ? previous.filter((id) => id !== tutorId)
        : [...previous, tutorId]
    ));
  };

  const handleRequest = async (tutor) => {
    try {
      const response = await requestConsultation(tutor.id);
      setRequestMessage(`${response.message} Scheduled for ${response.data.scheduledFor}.`);
    } catch (error) {
      if (error.status === 401) {
        onLogout?.();
        return;
      }

      setRequestMessage(error.message || 'Could not create the consultation request right now.');
    }
  };

  return (
    <DashboardShell
      title="Discover tutors"
      subtitle="Filter by subject, format, and search intent to build a shortlist before you book."
      onLogout={onLogout}
      actions={
        <Badge variant="yellow">
          {shortlist.length} shortlisted
        </Badge>
      }
    >
      <div className="portal-page">
        {loadError && <div className="portal-banner">{loadError}</div>}
        {requestMessage && <div className="portal-banner">{requestMessage}</div>}

        <section className="portal-toolbar-card">
          <div className="portal-toolbar-card__left">
            <Badge variant="ai" dot>
              AI discovery tools
            </Badge>
            <h2 className="portal-title">Refine the shortlist</h2>
          </div>

          <div className="portal-toolbar">
            <label className="portal-search">
              <SearchIcon size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by tutor, subject, or topic"
              />
            </label>

            <label className="portal-select">
              <FilterIcon size={14} />
              <select value={subject} onChange={(event) => setSubject(event.target.value)}>
                {filters.subjects.map((entry) => (
                  <option key={entry} value={entry}>{entry}</option>
                ))}
              </select>
            </label>

            <label className="portal-select">
              <CompassIcon size={14} />
              <select value={format} onChange={(event) => setFormat(event.target.value)}>
                {filters.formats.map((entry) => (
                  <option key={entry} value={entry}>{entry}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="portal-layout portal-layout--with-side">
          <section className="portal-stack">
            {tutors.map((tutor) => {
              const isShortlisted = shortlist.includes(tutor.id);

              return (
                <article className="portal-card portal-card--tutor" key={tutor.id}>
                  <div className="portal-card__header">
                    <div className="portal-avatar">{tutor.initials}</div>
                    <div className="portal-card__copy">
                      <div className="portal-card__title-row">
                        <h3 className="portal-card__title">{tutor.name}</h3>
                        {tutor.verified && (
                          <Badge variant="chain" size="sm">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="portal-card__sub">{tutor.subject} · {tutor.format}</p>
                    </div>
                  </div>

                  <p className="portal-card__body">{tutor.bio}</p>

                  <div className="portal-tag-row">
                    {tutor.tags.map((tag) => (
                      <span className="portal-tag" key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="portal-meta-grid">
                    <div className="portal-meta-item">
                      <ClockIcon size={15} />
                      <span>{tutor.responseTime}</span>
                    </div>
                    <div className="portal-meta-item">
                      <ShieldCheckIcon size={15} />
                      <span>{tutor.availability}</span>
                    </div>
                  </div>

                  <div className="portal-card__footer">
                    <div>
                      <div className="portal-rating">
                        <RatingStars value={5} size={13} className="portal-rating__stars" />
                        <span className="portal-rating__value">{tutor.rating}</span>
                        <span className="portal-rating__reviews">({tutor.reviews})</span>
                      </div>
                      <div className="portal-price">{tutor.price}</div>
                    </div>

                    <div className="portal-card__actions">
                      <Button variant={isShortlisted ? 'secondary' : 'outline'} size="sm" onClick={() => toggleShortlist(tutor.id)}>
                        {isShortlisted ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        iconRight={<ArrowRightIcon size={15} />}
                        onClick={() => handleRequest(tutor)}
                      >
                        Request
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}

            {tutors.length === 0 && (
              <div className="portal-empty">
                <h3>No tutors match the current filters</h3>
                <p>Try widening the subject or format selection to restore results.</p>
              </div>
            )}
          </section>

          <aside className="portal-side-card">
            <Badge variant="yellow" dot>
              Shortlist
            </Badge>
            <h3 className="portal-side-card__title">Ready-to-book tutors</h3>
            <p className="portal-side-card__sub">Save tutors here while you compare expertise, schedule fit, and session cost.</p>

            <div className="portal-side-card__list">
              {shortlistedTutors.length > 0 ? shortlistedTutors.map((tutor) => (
                <div className="portal-side-card__item" key={tutor.id}>
                  <div>
                    <strong>{tutor.name}</strong>
                    <span>{tutor.subject}</span>
                  </div>
                  <button type="button" className="portal-link-button" onClick={() => toggleShortlist(tutor.id)}>
                    Remove
                  </button>
                </div>
              )) : (
                <div className="portal-side-card__empty">
                  No tutors saved yet. Add a few options so you can compare them side by side.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
