import Logo from '../components/shared/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import './Dashboard.css';

export default function Dashboard({ role = 'student', onLogout }) {
  const isStudent = role === 'student';

  const stats = isStudent
    ? [
        { label: 'Sessions booked', value: '4', icon: '📅' },
        { label: 'Summaries received', value: '4', icon: '📋' },
        { label: 'Tutors matched', value: '12', icon: '🔍' },
      ]
    : [
        { label: 'Total sessions', value: '38', icon: '📅' },
        { label: 'On-chain rating', value: '4.96', icon: '⭐' },
        { label: 'Verified credentials', value: '3', icon: '🔗' },
      ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar__logo">
          <Logo variant="dark" size="sm" />
        </div>

        <nav className="dash-sidebar__nav">
          {(isStudent
            ? ['🏠 Home', '🔍 Find Tutors', '📅 My Sessions', '📋 Summaries', '⭐ Reviews']
            : ['🏠 Home', '📅 Bookings', '🎓 My Credentials', '⭐ My Ratings', '📋 Sessions']
          ).map((item, i) => (
            <button key={i} className={`dash-sidebar__item ${i === 0 ? 'dash-sidebar__item--active' : ''}`}>
              {item}
            </button>
          ))}
        </nav>

        <button className="dash-sidebar__logout" onClick={onLogout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1 className="dash-topbar__title">
              Good morning 👋
            </h1>
            <p className="dash-topbar__sub">
              {isStudent ? 'Find your perfect tutor today.' : 'Manage your sessions and credentials.'}
            </p>
          </div>
          <div className="dash-topbar__right">
            <Badge variant={isStudent ? 'ai' : 'chain'} dot>
              {isStudent ? 'Student' : 'Educator'}
            </Badge>
            <div className="dash-avatar">JD</div>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {stats.map(s => (
            <div className="dash-stat" key={s.label}>
              <span className="dash-stat__icon">{s.icon}</span>
              <div className="dash-stat__val">{s.value}</div>
              <div className="dash-stat__lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* AI search (student) */}
        {isStudent && (
          <div className="dash-search-card">
            <div className="dash-search-card__header">
              <Badge variant="ai" dot>AI Smart Search</Badge>
              <span className="dash-search-card__hint">Describe what you want to learn</span>
            </div>
            <div className="dash-search-card__input-row">
              <input
                className="dash-search-card__input"
                placeholder="e.g. I need help understanding integration by parts in calculus..."
              />
              <Button variant="primary" size="md">Match me →</Button>
            </div>
          </div>
        )}

        {/* Coming soon placeholder */}
        <div className="dash-coming">
          <div className="dash-coming__icon">🚀</div>
          <h2 className="dash-coming__title">Dashboard in progress</h2>
          <p className="dash-coming__sub">
            The full {isStudent ? 'student' : 'educator'} dashboard — tutor listings, booking calendar, AI chat, blockchain credential viewer, and session summaries — is being built. This is the foundation.
          </p>
          <Button variant="outline" size="md" onClick={onLogout}>← Back to landing</Button>
        </div>
      </main>
    </div>
  );
}