import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardShell from '../components/shared/DashboardShell';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CopyIcon,
  MessageSquareIcon,
  SendIcon,
  UsersIcon,
} from '../components/shared/Icons';
import { getConsultationSession, joinConsultationSession, saveConsultationNotes } from '../lib/api';
import './Portal.css';
import './ConsultationRoom.css';

export default function ConsultationRoom({ onLogout }) {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [meetingState, setMeetingState] = useState('Connecting room');
  const [notes, setNotes] = useState('');
  const [noteStatus, setNoteStatus] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadRoom = async () => {
      try {
        const [sessionResponse, joinResponse] = await Promise.all([
          getConsultationSession(sessionId),
          joinConsultationSession(sessionId),
        ]);

        if (!isMounted) {
          return;
        }

        setRoom(sessionResponse.data);
        setNotes(sessionResponse.data.notes || '');
        setMeetingState(joinResponse.data.meetingState || 'Room ready');
        setChatMessages([
          {
            id: 'assistant-1',
            sender: 'Convene System',
            text: `Room ${joinResponse.data.roomCode} is ready. Keep the agenda visible and capture action items before the session ends.`,
          },
        ]);
      } catch (requestError) {
        if (requestError.status === 401) {
          onLogout?.();
          return;
        }

        setError('Could not open the consultation room right now.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRoom();

    return () => {
      isMounted = false;
    };
  }, [onLogout, sessionId]);

  const handleSaveNotes = async () => {
    try {
      await saveConsultationNotes(sessionId, notes);
      setNoteStatus('Notes saved');
      window.setTimeout(() => setNoteStatus(''), 1800);
    } catch (requestError) {
      if (requestError.status === 401) {
        onLogout?.();
        return;
      }

      setNoteStatus('Could not save notes');
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const trimmed = draftMessage.trim();
    if (!trimmed) {
      return;
    }

    setChatMessages((previous) => [
      ...previous,
      { id: `user-${Date.now()}`, sender: 'You', text: trimmed },
      {
        id: `assistant-${Date.now() + 1}`,
        sender: room?.tutorName || 'Tutor',
        text: 'Acknowledged. Keep that point in the notes panel so it appears in the post-session summary.',
      },
    ]);
    setDraftMessage('');
  };

  const handleCopyRoomCode = async () => {
    if (!room?.roomCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(room.roomCode);
      setNoteStatus('Room code copied');
      window.setTimeout(() => setNoteStatus(''), 1800);
    } catch {
      setNoteStatus('Clipboard unavailable');
    }
  };

  return (
    <DashboardShell
      title="Consultation room"
      subtitle="Run the virtual consultation, keep live notes, and leave the session with a cleaner handoff into summaries."
      onLogout={onLogout}
      actions={
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/sessions')}>
          Back to sessions
        </Button>
      }
    >
      <div className="consultation-page">
        {loading && <div className="portal-banner">Connecting to the consultation room.</div>}
        {error && <div className="portal-banner">{error}</div>}

        {room && !loading && (
          <>
            <section className="consultation-hero">
              <div>
                <Badge variant="ai" dot>{meetingState}</Badge>
                <h2>{room.subject}</h2>
                <p>Session with {room.tutorName} in room {room.roomCode}</p>
              </div>
              <div className="consultation-hero__actions">
                <Button variant="outline" size="sm" icon={<CopyIcon size={14} />} onClick={handleCopyRoomCode}>
                  Copy room code
                </Button>
                <Badge variant="chain">{room.mode}</Badge>
              </div>
            </section>

            <section className="consultation-grid">
              <div className="consultation-stage">
                <div className="consultation-stage__feed consultation-stage__feed--primary">
                  <div className="consultation-stage__label">Main speaker</div>
                  <strong>{room.tutorName}</strong>
                  <span>{room.subject}</span>
                </div>
                <div className="consultation-stage__row">
                  <div className="consultation-stage__feed">
                    <div className="consultation-stage__label">Learner feed</div>
                    <strong>You</strong>
                    <span>Connected and ready</span>
                  </div>
                  <div className="consultation-stage__feed">
                    <div className="consultation-stage__label">Session status</div>
                    <strong>{room.status}</strong>
                    <span>{room.summaryReady ? 'Summary can be generated immediately' : 'Summary will be created after the call'}</span>
                  </div>
                </div>
              </div>

              <aside className="consultation-side">
                <div className="consultation-panel">
                  <div className="consultation-panel__header">
                    <h3>Session details</h3>
                    <CalendarIcon size={15} />
                  </div>
                  <div className="consultation-meta-list">
                    <div className="consultation-meta-item"><CalendarIcon size={15} /><span>{room.scheduledFor}</span></div>
                    <div className="consultation-meta-item"><ClockIcon size={15} /><span>{room.durationMinutes} minute consultation</span></div>
                    <div className="consultation-meta-item"><UsersIcon size={15} /><span>{room.participants.length} participants connected</span></div>
                  </div>
                </div>

                <div className="consultation-panel">
                  <div className="consultation-panel__header">
                    <h3>Agenda</h3>
                    <CheckCircleIcon size={15} />
                  </div>
                  <div className="consultation-agenda">
                    {room.agenda.map((item) => (
                      <div className="consultation-agenda__item" key={item}>
                        <CheckCircleIcon size={14} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </section>

            <section className="consultation-workspace">
              <div className="consultation-panel consultation-panel--notes">
                <div className="consultation-panel__header">
                  <h3>Live consultation notes</h3>
                  {noteStatus && <span className="consultation-status">{noteStatus}</span>}
                </div>
                <textarea
                  className="consultation-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Capture explanations, worked examples, and next-step recommendations here."
                />
                <div className="consultation-panel__footer">
                  <Button variant="primary" size="sm" onClick={handleSaveNotes}>Save notes</Button>
                </div>
              </div>

              <div className="consultation-panel consultation-panel--chat">
                <div className="consultation-panel__header">
                  <h3>In-session chat</h3>
                  <MessageSquareIcon size={15} />
                </div>
                <div className="consultation-chat">
                  {chatMessages.map((message) => (
                    <div className="consultation-chat__item" key={message.id}>
                      <strong>{message.sender}</strong>
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>
                <form className="consultation-chat__form" onSubmit={handleSendMessage}>
                  <input
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    placeholder="Share a question or note for the consultation"
                  />
                  <button type="submit" aria-label="Send consultation chat message">
                    <SendIcon size={14} />
                  </button>
                </form>
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
