import { useEffect, useRef, useState } from 'react';
import Logo from '../components/shared/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import './Dashboard.css';

export default function Dashboard({ role = 'student', onLogout }) {
  const [user, setUser] = useState(null);
  const [userFetchError, setUserFetchError] = useState('');
  const effectiveRole = (user?.role || role || 'student').toLowerCase();
  const userInitials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase();
  const isStudent = effectiveRole === 'student';
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeStudentView, setActiveStudentView] = useState('home');
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: '👋 Hi! Need help finding a tutor, checking sessions, or reviewing summaries?',
      createdAt: Date.now(),
    },
  ]);
  const chatBodyRef = useRef(null);

  const studentNavItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'find-tutors', label: 'Find Tutors', icon: '🔍' },
    { id: 'my-sessions', label: 'My Sessions', icon: '📅' },
    { id: 'summaries', label: 'Summaries', icon: '📋' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
  ];

  const studentViewMeta = {
    home: {
      title: 'Good morning 👋',
      subtitle: 'Find your perfect tutor today.',
    },
    'find-tutors': {
      title: 'Find Tutors',
      subtitle: 'Discover and match with tutors based on your learning goals.',
    },
    'my-sessions': {
      title: 'My Sessions',
      subtitle: 'Track upcoming bookings and revisit past sessions.',
    },
    summaries: {
      title: 'Summaries',
      subtitle: 'See AI-generated notes and key takeaways from sessions.',
    },
    reviews: {
      title: 'Reviews',
      subtitle: 'Check your tutor feedback and ratings in one place.',
    },
  };

  const activeMeta = isStudent
    ? studentViewMeta[activeStudentView] ?? studentViewMeta.home
    : {
        title: 'Good morning 👋',
        subtitle: 'Manage your sessions and credentials.',
      };

  const buildFallbackReply = (message) => {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes('tutor') || activeStudentView === 'find-tutors') {
      return 'I can help with tutor matching. Once backend is connected, I will return ranked tutors by subject, rate, and availability.';
    }

    if (normalizedMessage.includes('session') || activeStudentView === 'my-sessions') {
      return 'I can summarize your upcoming and past sessions. Backend integration will let me pull your real booking timeline.';
    }

    if (normalizedMessage.includes('summary') || activeStudentView === 'summaries') {
      return 'I can generate and fetch session summaries. When your API is ready, I can return recap cards with action items.';
    }

    if (normalizedMessage.includes('review') || activeStudentView === 'reviews') {
      return 'I can help analyze your reviews and ratings. After backend setup, I can surface trends and highlight tutor feedback.';
    }

    return 'Got it. Ask me anything about your learning sessions and tutor matching.';
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage || isChatLoading) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedMessage,
      createdAt: Date.now(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const base = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      let responseData = null;
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        if (response.status === 401) {
          onLogout?.();
          return;
        }
        throw new Error(responseData?.message || 'Chat request failed');
      }

      let assistantText = responseData?.message || responseData?.reply || responseData?.text || '';

      if (!assistantText) {
        assistantText = buildFallbackReply(trimmedMessage);
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: assistantText,
          createdAt: Date.now(),
        },
      ]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          text: 'I could not reach the chat service right now. Please try again.',
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (!chatBodyRef.current) {
      return;
    }

    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatMessages, isChatLoading, isChatOpen]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    const base = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const fetchUser = async () => {
      try {
        const response = await fetch(`${base}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            onLogout?.();
            return;
          }
          setUserFetchError('Could not load your profile right now.');
          return;
        }

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } catch {
        setUserFetchError('Could not load your profile right now.');
      }
    };

    fetchUser();
  }, [onLogout]);

  const stats = isStudent
    ? [
        { label: 'Sessions booked', value: '0', icon: '📅' },
        { label: 'Summaries received', value: '0', icon: '📋' },
        { label: 'Tutors matched', value: '0', icon: '🔍' },
      ]
    : [
        { label: 'Total sessions', value: '38', icon: '📅' },
        { label: 'Average rating', value: '4.96', icon: '⭐' },
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
            ? studentNavItems
            : ['🏠 Home', '📅 Bookings', '🎓 My Credentials', '⭐ My Ratings', '📋 Sessions']
          ).map((item, i) => (
            <button
              key={isStudent ? item.id : i}
              className={`dash-sidebar__item ${isStudent ? (activeStudentView === item.id ? 'dash-sidebar__item--active' : '') : (i === 0 ? 'dash-sidebar__item--active' : '')}`}
              type="button"
              onClick={isStudent ? () => setActiveStudentView(item.id) : undefined}
            >
              {isStudent ? `${item.icon} ${item.label}` : item}
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
              {activeMeta.title}
            </h1>
            <p className="dash-topbar__sub">
              {activeMeta.subtitle}
            </p>
            {user?.name && (
              <p className="dash-topbar__sub">Signed in as {user.name}</p>
            )}
            {userFetchError && (
              <p className="dash-topbar__sub">{userFetchError}</p>
            )}
          </div>
          <div className="dash-topbar__right">
            <Badge variant={isStudent ? 'ai' : 'chain'} dot>
              {isStudent ? 'Student' : 'Educator'}
            </Badge>
            <div className="dash-avatar">{userInitials}</div>
          </div>
        </div>

        {(isStudent && activeStudentView === 'home') || !isStudent ? (
          <>
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
          </>
        ) : null}

        {/* AI search (student home) */}
        {isStudent && activeStudentView === 'home' && (
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

        {isStudent && activeStudentView === 'find-tutors' && (
          <div className="dash-coming">
            <div className="dash-coming__icon">🔍</div>
            <h2 className="dash-coming__title">Tutor discovery</h2>
            <p className="dash-coming__sub">
              Browse verified tutors by subject, availability, teaching style, and ratings. Your personalized tutor list will appear here.
            </p>
          </div>
        )}

        {isStudent && activeStudentView === 'my-sessions' && (
          <div className="dash-coming">
            <div className="dash-coming__icon">📅</div>
            <h2 className="dash-coming__title">Session timeline</h2>
            <p className="dash-coming__sub">
              See upcoming classes, join links, reschedule options, and past session history in one organized view.
            </p>
          </div>
        )}

        {isStudent && activeStudentView === 'summaries' && (
          <div className="dash-coming">
            <div className="dash-coming__icon">📋</div>
            <h2 className="dash-coming__title">Learning summaries</h2>
            <p className="dash-coming__sub">
              AI-generated recap notes, key points, and action items from your sessions will show up here.
            </p>
          </div>
        )}

        {isStudent && activeStudentView === 'reviews' && (
          <div className="dash-coming">
            <div className="dash-coming__icon">⭐</div>
            <h2 className="dash-coming__title">Reviews and feedback</h2>
            <p className="dash-coming__sub">
              View tutor ratings, your submitted reviews, and feedback insights to improve your study journey.
            </p>
          </div>
        )}

        {/* Coming soon placeholder */}
        {(!isStudent || activeStudentView === 'home') && (
          <div className="dash-coming">
            <div className="dash-coming__icon">🚀</div>
            <h2 className="dash-coming__title">Dashboard in progress</h2>
            <p className="dash-coming__sub">
              The full {isStudent ? 'student' : 'educator'} dashboard — tutor listings, booking calendar, AI chat, credential viewer, and session summaries — is being built. This is the foundation.
            </p>
            <Button variant="outline" size="md" onClick={onLogout}>← Back to landing</Button>
          </div>
        )}
      </main>

      <button
        className="dash-chat-launcher"
        type="button"
        onClick={() => setIsChatOpen(prev => !prev)}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {isChatOpen ? '✕' : '💬'}
      </button>

      {isChatOpen && (
        <section className="dash-chat" aria-label="Convene assistant chat">
          <header className="dash-chat__header">
            <div>
              <h3 className="dash-chat__title">Convene Assistant</h3>
              <p className="dash-chat__status">Online now</p>
            </div>
            <button
              className="dash-chat__close"
              type="button"
              onClick={() => setIsChatOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </header>

          <div className="dash-chat__body" ref={chatBodyRef}>
            {chatMessages.map(message => (
              <div
                key={message.id}
                className={`dash-chat__bubble ${message.role === 'user' ? 'dash-chat__bubble--user' : 'dash-chat__bubble--bot'}`}
              >
                {message.text}
              </div>
            ))}

            {isChatLoading && (
              <div className="dash-chat__bubble dash-chat__bubble--bot dash-chat__bubble--typing">
                Assistant is typing...
              </div>
            )}
          </div>

          <form className="dash-chat__input-row" onSubmit={handleChatSubmit}>
            <input
              className="dash-chat__input"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              disabled={isChatLoading}
            />
            <button className="dash-chat__send" type="submit" disabled={isChatLoading || !chatInput.trim()}>
              {isChatLoading ? '...' : 'Send'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}