import { useEffect, useState } from 'react';
import DashboardShell from '../components/shared/DashboardShell';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { CopyIcon, FileTextIcon, SearchIcon } from '../components/shared/Icons';
import { getLearningSummaries } from '../lib/api';
import './Portal.css';

export default function Summaries({ onLogout }) {
  const [query, setQuery] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSummaries = async () => {
      try {
        const response = await getLearningSummaries(query);
        if (isMounted) {
          setSummaries(response.data || []);
          setLoadError('');
        }
      } catch (error) {
        if (error.status === 401) {
          onLogout?.();
          return;
        }

        if (isMounted) {
          setLoadError('Could not load summaries right now.');
        }
      }
    };

    loadSummaries();

    return () => {
      isMounted = false;
    };
  }, [onLogout, query]);

  const activeSummary = summaries.find((summary) => summary.id === activeId) || summaries[0] || null;

  useEffect(() => {
    if (!activeSummary) {
      return;
    }

    setActiveId(activeSummary.id);
  }, [activeSummary]);

  const handleCopy = async () => {
    if (!activeSummary) {
      return;
    }

    const text = activeSummary.actionItems.join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage('Action items copied.');
    } catch {
      setCopyMessage('Clipboard access is unavailable in this browser.');
    }
  };

  return (
    <DashboardShell
      title="AI summaries"
      subtitle="Search previous tutoring notes, inspect takeaways, and copy next-action lists into your own study workflow."
      onLogout={onLogout}
      actions={copyMessage ? <Badge variant="yellow">{copyMessage}</Badge> : null}
    >
      <div className="portal-page">
        {loadError && <div className="portal-banner">{loadError}</div>}
        <section className="portal-toolbar-card">
          <div className="portal-toolbar-card__left">
            <Badge variant="ai" dot>
              Study memory
            </Badge>
            <h2 className="portal-title">Review what each session produced</h2>
          </div>

          <label className="portal-search portal-search--wide">
            <SearchIcon size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by concept, tutor, or tag"
            />
          </label>
        </section>

        <div className="portal-layout portal-layout--detail">
          <section className="portal-list-card">
            {summaries.map((summary) => (
              <button
                type="button"
                key={summary.id}
                className={`portal-list-item ${activeSummary?.id === summary.id ? 'portal-list-item--active' : ''}`}
                onClick={() => setActiveId(summary.id)}
              >
                <div className="portal-list-item__icon">
                  <FileTextIcon size={16} />
                </div>
                <div>
                  <strong>{summary.title}</strong>
                  <span>{summary.subject} · {summary.date}</span>
                </div>
              </button>
            ))}
          </section>

          <section className="portal-detail-card">
            {activeSummary ? (
              <>
                <div className="portal-detail-card__header">
                  <div>
                    <Badge variant="chain" size="sm">{activeSummary.subject}</Badge>
                    <h3 className="portal-detail-card__title">{activeSummary.title}</h3>
                    <p className="portal-detail-card__sub">Session with {activeSummary.tutorName} on {activeSummary.date}</p>
                  </div>
                  <Button variant="outline" size="sm" icon={<CopyIcon size={15} />} onClick={handleCopy}>
                    Copy actions
                  </Button>
                </div>

                <p className="portal-detail-card__overview">{activeSummary.overview}</p>

                <div className="portal-detail-card__tags">
                  {activeSummary.tags.map((tag) => (
                    <span className="portal-tag" key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="portal-detail-card__sections">
                  <div>
                    <h4>Key takeaways</h4>
                    <ul className="portal-bullet-list">
                      {activeSummary.takeaways.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h4>Next actions</h4>
                    <ul className="portal-bullet-list">
                      {activeSummary.actionItems.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="portal-empty">
                <h3>No summaries match the current search</h3>
                <p>Adjust the query to see the available study notes again.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
