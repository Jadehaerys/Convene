import { Link } from 'react-router-dom';
import Logo from '../components/shared/Logo';
import Badge from '../components/ui/Badge';
import { ArrowLeftIcon, MailIcon, MapPinIcon, PhoneIcon } from '../components/shared/Icons';
import './InfoPage.css';

const PAGE_CONTENT = {
  privacy: {
    eyebrow: 'Privacy',
    title: 'Privacy policy',
    intro: 'Convene collects only the information needed to run tutor discovery, account access, and learning-session workflows. This page sets the structure for a fuller production policy later.',
    sections: [
      {
        heading: 'What we collect',
        body: 'Basic profile information, booking activity, session summaries, and support requests may be stored so learners and educators can complete platform workflows without losing context.',
      },
      {
        heading: 'How it is used',
        body: 'The data is used to rank tutor matches, preserve your dashboard state, and make follow-up sessions easier to manage. Sensitive information should remain limited to what the platform actually needs.',
      },
      {
        heading: 'Next backend step',
        body: 'Once the backend policy endpoints are ready, this page can be fed from managed policy content instead of static frontend copy.',
      },
    ],
  },
  terms: {
    eyebrow: 'Terms',
    title: 'Terms of service',
    intro: 'These terms describe the expected behavior for learners, educators, and administrators using the Convene platform during booking and consultation workflows.',
    sections: [
      {
        heading: 'Platform use',
        body: 'Users are expected to provide accurate information, respect booking commitments, and avoid using the platform for fraudulent or abusive conduct.',
      },
      {
        heading: 'Tutor representation',
        body: 'Educators should present credentials and pricing truthfully. Verified status should correspond to approved documentation, not self-declared claims.',
      },
      {
        heading: 'Session conduct',
        body: 'Both parties should keep communication professional and use the support channel if a booking, payment, or conduct issue needs review.',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Reach the Convene team',
    intro: 'Use these channels when you need support beyond the in-app assistant or want to ask about the product roadmap and institution partnerships.',
    sections: [
      {
        heading: 'Support queue',
        body: 'For learner and tutor issues, the in-app support page should be the first stop because it keeps the issue category structured.',
      },
      {
        heading: 'Partnership inquiries',
        body: 'Schools and educator communities can use the contact email below to discuss onboarding and platform pilots.',
      },
      {
        heading: 'Operating region',
        body: 'The current product direction remains focused on Cebu-based students and educators while the platform foundation is being built out.',
      },
    ],
  },
};

export default function InfoPage({ variant = 'privacy' }) {
  const page = PAGE_CONTENT[variant] || PAGE_CONTENT.privacy;

  return (
    <div className="info-page">
      <header className="info-page__nav">
        <div className="container info-page__nav-inner">
          <Logo variant="dark" size="sm" />
          <Link to="/" className="info-page__back-link">
            <ArrowLeftIcon size={14} />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      <main className="info-page__main">
        <div className="container info-page__grid">
          <section className="info-page__content">
            <Badge variant="yellow" dot>{page.eyebrow}</Badge>
            <h1 className="info-page__title">{page.title}</h1>
            <p className="info-page__intro">{page.intro}</p>

            <div className="info-page__sections">
              {page.sections.map((section) => (
                <article className="info-page__section" key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="info-page__side-card">
            <Badge variant="chain" dot>Contact details</Badge>
            <div className="info-page__contact-item">
              <MailIcon size={16} />
              <span>support@convene.local</span>
            </div>
            <div className="info-page__contact-item">
              <PhoneIcon size={16} />
              <span>+63 32 555 0127</span>
            </div>
            <div className="info-page__contact-item">
              <MapPinIcon size={16} />
              <span>Cebu and Naga City, Philippines</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
