import { useEffect, useState } from 'react';
import DashboardShell from '../components/shared/DashboardShell';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { LifeBuoyIcon, MailIcon, MessageSquareIcon, PhoneIcon, SearchIcon } from '../components/shared/Icons';
import { getStoredUser, getSupportFaqs, submitSupportTicket } from '../lib/api';
import './Portal.css';

export default function Support({ onLogout }) {
  const [query, setQuery] = useState('');
  const storedUser = getStoredUser();
  const [form, setForm] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('convene_support_draft') || 'null') || {
        topic: 'Booking',
        email: storedUser?.email || '',
        message: '',
      };
    } catch {
      return { topic: 'Booking', email: storedUser?.email || '', message: '' };
    }
  });
  const [confirmation, setConfirmation] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    localStorage.setItem('convene_support_draft', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    let isMounted = true;

    const loadFaqs = async () => {
      try {
        const response = await getSupportFaqs(query);
        if (isMounted) {
          setFaqs(response.data || []);
          setLoadError('');
        }
      } catch (error) {
        if (error.status === 401) {
          onLogout?.();
          return;
        }

        if (isMounted) {
          setLoadError('Could not load support resources right now.');
        }
      }
    };

    loadFaqs();

    return () => {
      isMounted = false;
    };
  }, [onLogout, query]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const submit = async () => {
      if (!form.email || !form.message.trim()) {
        setConfirmation('Add an email and issue summary before submitting.');
        return;
      }

      try {
        const response = await submitSupportTicket(form);
        setConfirmation(`${response.message} Ticket #${response.data.id} is now ${response.data.status.toLowerCase()}.`);
        const nextDraft = { topic: form.topic, email: form.email, message: '' };
        setForm(nextDraft);
        localStorage.setItem('convene_support_draft', JSON.stringify(nextDraft));
      } catch (error) {
        if (error.status === 401) {
          onLogout?.();
          return;
        }

        setConfirmation(error.message || 'Could not submit the support request right now.');
      }
    };

    submit();
  };

  const setField = (key) => (event) => setForm((previous) => ({ ...previous, [key]: event.target.value }));

  return (
    <DashboardShell
      title="Support center"
      subtitle="Search common questions, prepare a support request, and keep the issue details structured before backend integration."
      onLogout={onLogout}
      actions={confirmation ? <Badge variant="yellow">Status updated</Badge> : null}
    >
      <div className="portal-page">
        {loadError && <div className="portal-banner">{loadError}</div>}
        <div className="portal-layout portal-layout--detail">
          <section className="portal-detail-card">
            <div className="portal-detail-card__header">
              <div>
                <Badge variant="chain" dot>
                  Help resources
                </Badge>
                <h3 className="portal-detail-card__title">Search the FAQ</h3>
              </div>
            </div>

            <label className="portal-search portal-search--wide">
              <SearchIcon size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find guidance on matching, booking, or summaries"
              />
            </label>

            <div className="portal-faq-list">
              {faqs.map((faq) => (
                <article className="portal-faq-item" key={faq.id}>
                  <div className="portal-faq-item__header">
                    <Badge variant="default" size="sm">{faq.category}</Badge>
                    <strong>{faq.question}</strong>
                  </div>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="portal-side-card portal-side-card--form">
            <Badge variant="yellow" dot>
              Issue intake
            </Badge>
            <h3 className="portal-side-card__title">Prepare a support request</h3>
            <p className="portal-side-card__sub">This form keeps message structure in place so it can connect to the backend later without changing the UI flow.</p>

            <form className="portal-form" onSubmit={handleSubmit}>
              <label>
                <span>Topic</span>
                <select value={form.topic} onChange={setField('topic')}>
                  <option value="Booking">Booking</option>
                  <option value="Tutor profile">Tutor profile</option>
                  <option value="Summary issue">Summary issue</option>
                  <option value="Account">Account</option>
                </select>
              </label>

              <label>
                <span>Email</span>
                <input value={form.email} onChange={setField('email')} placeholder="you@example.com" />
              </label>

              <label>
                <span>Message</span>
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={setField('message')}
                  placeholder="Describe the issue and what you expected to happen"
                />
              </label>

              <Button type="submit" variant="primary" size="md">Stage request</Button>
            </form>

            {confirmation && <div className="portal-banner">{confirmation}</div>}

            <div className="portal-contact-grid">
              <div className="portal-contact-card">
                <MailIcon size={16} />
                <span>support@convene.local</span>
              </div>
              <div className="portal-contact-card">
                <PhoneIcon size={16} />
                <span>+63 32 555 0127</span>
              </div>
              <div className="portal-contact-card">
                <MessageSquareIcon size={16} />
                <span>Live assistant available in-app</span>
              </div>
              <div className="portal-contact-card">
                <LifeBuoyIcon size={16} />
                <span>Average reply target: under 1 business day</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
