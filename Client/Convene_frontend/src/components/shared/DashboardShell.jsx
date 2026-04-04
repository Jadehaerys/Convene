import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import Badge from '../ui/Badge';
import {
  BotIcon,
  CalendarIcon,
  CompassIcon,
  FileTextIcon,
  HomeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MessageSquareIcon,
  SendIcon,
  XIcon,
} from './Icons';
import { getInitials } from '../../data/mockData';
import './DashboardShell.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: HomeIcon, end: true },
  { to: '/dashboard/tutors', label: 'Discover', icon: CompassIcon },
  { to: '/dashboard/sessions', label: 'Sessions', icon: CalendarIcon },
  { to: '/dashboard/summaries', label: 'Summaries', icon: FileTextIcon },
  { to: '/dashboard/support', label: 'Support', icon: LifeBuoyIcon },
];

function buildFallbackReply(pathname, message) {
  const normalizedMessage = message.toLowerCase();

  if (pathname.includes('/tutors') || normalizedMessage.includes('tutor') || normalizedMessage.includes('match')) {
    return 'I can help narrow tutor options by subject, format, rating, and availability. Use the discover page filters and I will keep the list focused.';
  }

  if (pathname.includes('/sessions') || normalizedMessage.includes('session') || normalizedMessage.includes('reschedule')) {
    return 'I can help you review upcoming sessions, highlight alternate time slots, and confirm what still needs preparation.';
  }

  if (pathname.includes('/summaries') || normalizedMessage.includes('summary') || normalizedMessage.includes('notes')) {
    return 'I can point you to the most relevant summary and help turn the takeaways into your next study plan.';
  }

  if (pathname.includes('/support') || normalizedMessage.includes('support') || normalizedMessage.includes('issue')) {
    return 'I can help classify your issue and route it into the right support topic so follow-up is clearer.';
  }

  return 'Ask me about tutor discovery, booking flow, or study summaries and I will respond with the closest next step.';
}

export default function DashboardShell({ title, subtitle, onLogout, role = 'student', actions = null, children }) {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user') || 'null');
    } catch {
      return null;
    }
  });
  const [userFetchError, setUserFetchError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: 'Need help finding a tutor, adjusting a booking, or reviewing study notes?',
      createdAt: Date.now(),
    },
  ]);
  const chatBodyRef = useRef(null);

  const effectiveRole = (user?.role || role || 'student').toLowerCase();
  const roleLabel = effectiveRole === 'tutor' ? 'Educator' : 'Student';
  const roleVariant = effectiveRole === 'tutor' ? 'chain' : 'ai';
  const userInitials = getInitials(user?.name || roleLabel);

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

    setChatMessages((previous) => [...previous, userMessage]);
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

      const assistantText = responseData?.message || responseData?.reply || responseData?.text || buildFallbackReply(location.pathname, trimmedMessage);

      setChatMessages((previous) => [
        ...previous,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: assistantText,
          createdAt: Date.now(),
        },
      ]);
    } catch {
      setChatMessages((previous) => [
        ...previous,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          text: buildFallbackReply(location.pathname, trimmedMessage),
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <aside className="dash-sidebar">
        <div className="dash-sidebar__logo">
          <Logo variant="dark" size="sm" />
        </div>

        <nav className="dash-sidebar__nav" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `dash-sidebar__item ${isActive ? 'dash-sidebar__item--active' : ''}`.trim()}
              >
                <Icon size={16} className="dash-sidebar__item-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button className="dash-sidebar__logout" type="button" onClick={onLogout}>
          <LogOutIcon size={15} />
          <span>Sign out</span>
        </button>
      </aside>

      <div className="dash-shell__body">
        <main className="dash-main">
          <div className="dash-topbar">
            <div>
              <h1 className="dash-topbar__title">{title}</h1>
              <p className="dash-topbar__sub">{subtitle}</p>
              {user?.name && <p className="dash-topbar__sub">Signed in as {user.name}</p>}
              {userFetchError && <p className="dash-topbar__sub">{userFetchError}</p>}
            </div>

            <div className="dash-topbar__right">
              {actions && <div className="dash-topbar__actions">{actions}</div>}
              <Badge variant={roleVariant} dot>
                {roleLabel}
              </Badge>
              <div className="dash-avatar">{userInitials}</div>
            </div>
          </div>

          {children}
        </main>

        <nav className="dash-mobile-nav" aria-label="Mobile dashboard navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `dash-mobile-nav__item ${isActive ? 'dash-mobile-nav__item--active' : ''}`.trim()}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button
        className="dash-chat-launcher"
        type="button"
        onClick={() => setIsChatOpen((previous) => !previous)}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {isChatOpen ? <XIcon size={18} /> : <MessageSquareIcon size={18} />}
      </button>

      {isChatOpen && (
        <section className="dash-chat" aria-label="Convene assistant chat">
          <header className="dash-chat__header">
            <div className="dash-chat__header-copy">
              <span className="dash-chat__badge">
                <BotIcon size={14} />
                Convene Assistant
              </span>
              <p className="dash-chat__status">Context-aware workspace support</p>
            </div>
            <button className="dash-chat__close" type="button" onClick={() => setIsChatOpen(false)} aria-label="Close chat">
              <XIcon size={14} />
            </button>
          </header>

          <div className="dash-chat__body" ref={chatBodyRef}>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`dash-chat__bubble ${message.role === 'user' ? 'dash-chat__bubble--user' : 'dash-chat__bubble--bot'}`}
              >
                {message.text}
              </div>
            ))}

            {isChatLoading && (
              <div className="dash-chat__bubble dash-chat__bubble--bot dash-chat__bubble--typing">
                Assistant is preparing a response.
              </div>
            )}
          </div>

          <form className="dash-chat__input-row" onSubmit={handleChatSubmit}>
            <input
              className="dash-chat__input"
              placeholder="Ask about tutors, bookings, or notes"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              disabled={isChatLoading}
            />
            <button className="dash-chat__send" type="submit" disabled={isChatLoading || !chatInput.trim()}>
              <SendIcon size={15} />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
