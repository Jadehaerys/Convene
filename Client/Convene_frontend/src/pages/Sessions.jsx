import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/shared/DashboardShell';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { ArrowRightIcon, CalendarIcon, CheckCircleIcon, ClockIcon, CompassIcon } from '../components/shared/Icons';
import { getConsultationSessions, rotateConsultationSlot, updatePreparedState } from '../lib/api';
import './Portal.css';

export default function Sessions({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [sessions, setSessions] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSessions = async () => {
      try {
        const response = await getConsultationSessions();
        if (isMounted) {
          setSessions(response.data || []);
          setLoadError('');
        }
      } catch (error) {
        if (error.status === 401) {
          onLogout?.();
          return;
        }

        if (isMounted) {
          setLoadError('Could not load consultation sessions right now.');
        }
      }
    };

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, [onLogout]);

  const visibleSessions = sessions.filter((session) => session.status === activeTab);

  const togglePrepared = async (sessionId) => {
    try {
      const response = await updatePreparedState(sessionId);
      setSessions((previous) => previous.map((session) => (
        session.id === sessionId ? response.data : session
      )));
      setStatusMessage(response.message);
    } catch (error) {
      if (error.status === 401) {
        onLogout?.();
        return;
      }

      setStatusMessage(error.message || 'Could not update preparation status.');
    }
  };

  const rotateSlot = async (sessionId) => {
    try {
      const response = await rotateConsultationSlot(sessionId);
      setSessions((previous) => previous.map((session) => (
        session.id === sessionId ? response.data : session
      )));
      setStatusMessage(response.message);
    } catch (error) {
      if (error.status === 401) {
        onLogout?.();
        return;
      }

      setStatusMessage(error.message || 'Could not rotate the session slot.');
    }
  };

  return (
    <DashboardShell
      title="Session planner"
      subtitle="Track upcoming consultations, rotate through alternate slots, and mark preparation complete before the call starts."
      onLogout={onLogout}
    >
      <div className="portal-page">
        {loadError && <div className="portal-banner">{loadError}</div>}
        {statusMessage && <div className="portal-banner">{statusMessage}</div>}
        <section className="portal-toolbar-card">
          <div className="portal-toolbar-card__left">
            <Badge variant="chain" dot>
              Booking flow
            </Badge>
            <h2 className="portal-title">Manage the timeline</h2>
          </div>

          <div className="portal-tab-row">
            {['Upcoming', 'Completed'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`portal-tab ${activeTab === tab ? 'portal-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="portal-stack">
          {visibleSessions.map((session) => {
            return (
              <article className="portal-card portal-card--session" key={session.id}>
                <div className="portal-card__header portal-card__header--split">
                  <div>
                    <h3 className="portal-card__title">{session.subject}</h3>
                    <p className="portal-card__sub">with {session.tutorName}</p>
                  </div>
                  <Badge variant={session.status === 'Upcoming' ? 'ai' : 'default'}>
                    {session.status}
                  </Badge>
                </div>

                <div className="portal-meta-grid">
                  <div className="portal-meta-item">
                    <CalendarIcon size={15} />
                    <span>{session.scheduledFor}</span>
                  </div>
                  <div className="portal-meta-item">
                    <CompassIcon size={15} />
                    <span>{session.mode}</span>
                  </div>
                  <div className="portal-meta-item">
                    <ClockIcon size={15} />
                    <span>{session.summaryReady ? 'Summary available' : 'Summary pending'}</span>
                  </div>
                </div>

                <div className="portal-checklist">
                  {session.agenda.map((item) => (
                    <div className="portal-checklist__item" key={item}>
                      <CheckCircleIcon size={15} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="portal-card__footer">
                  <div className="portal-status-copy">
                    <strong>{session.prepared ? 'Preparation marked complete' : 'Preparation still open'}</strong>
                    <span>Use this flag to keep your next session ready.</span>
                  </div>

                  <div className="portal-card__actions">
                    {session.status === 'Upcoming' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => rotateSlot(session.id)}>
                          Rotate slot
                        </Button>
                        <Button variant="ghost" size="sm" iconRight={<ArrowRightIcon size={14} />} onClick={() => navigate(`/dashboard/sessions/${session.id}/room`)}>
                          Open room
                        </Button>
                      </>
                    )}
                    <Button variant={session.prepared ? 'secondary' : 'primary'} size="sm" onClick={() => togglePrepared(session.id)}>
                      {session.prepared ? 'Prepared' : 'Mark prepared'}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </DashboardShell>
  );
}
