import { useState } from 'react';
import Logo from '../components/shared/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import './Auth.css';

const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function Auth({ initialMode = 'login', onSuccess, onBack }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'role'
  const [role, setRole] = useState(null); // 'student' | 'tutor'
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '',
  });
  const [errors, setErrors] = useState({});

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email)    e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (mode === 'signup') {
      if (!form.firstName) e.firstName = 'First name is required';
      if (!form.lastName)  e.lastName  = 'Last name is required';
      if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
      else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (mode === 'signup' && !role) {
      setMode('role');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    const base = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
      let token = '';

      if (mode === 'signup') {
        const res = await fetch(`${base}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setApiError(data.message || 'Registration failed. Please try again.');
          return;
        }
        token = data.token ?? data.access_token ?? '';
      } else {
        const res = await fetch(`${base}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setApiError(data.message || 'Invalid credentials. Please try again.');
          return;
        }
        token = data.token ?? data.access_token ?? '';
      }

      if (token) {
        localStorage.setItem('auth_token', token);
        onSuccess?.();
      } else {
        setApiError('Authentication succeeded but no token was returned.');
      }
    } catch {
      setApiError('Network error — make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (r) => {
    setRole(r);
    setMode('signup');
  };

  return (
    <div className="auth">
      {/* Left panel — branding */}
      <div className="auth__left">
        <div className="auth__left-bg">
          <div className="auth__left-orb auth__left-orb--1" />
          <div className="auth__left-orb auth__left-orb--2" />
          <div className="auth__left-grid" />
        </div>

        <div className="auth__left-content">
          <button className="auth__back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to home
          </button>

          <div className="auth__brand">
            <Logo variant="dark" size="lg" />
            <p className="auth__brand-tagline">AI Education Platform</p>
          </div>

          <div className="auth__left-pills">
            <div className="auth__pill">
              <span className="auth__pill-icon"></span>
              <div>
                <div className="auth__pill-title">Verified Profiles</div>
                <div className="auth__pill-sub">Trusted educator credentials</div>
              </div>
            </div>
            <div className="auth__pill">
              <span className="auth__pill-icon"></span>
              <div>
                <div className="auth__pill-title">AI-Powered Matching</div>
                <div className="auth__pill-sub">NLP semantic search</div>
              </div>
            </div>
            <div className="auth__pill">
              <span className="auth__pill-icon"></span>
              <div>
                <div className="auth__pill-title">Auto Session Summaries</div>
                <div className="auth__pill-sub">Never lose a note again</div>
              </div>
            </div>
          </div>

          <div className="auth__left-stat">
            <div className="auth__stat-num">200+</div>
            <div className="auth__stat-lbl">Verified tutors in Cebu</div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth__right">
        <div className="auth__form-wrap">

          {/* ── ROLE SELECTION ── */}
          {mode === 'role' && (
            <div className="auth__form anim-ready">
              <div className="auth__form-header">
                <h1 className="auth__form-title">I am a…</h1>
                <p className="auth__form-sub">Tell us who you are so we can set up the right experience.</p>
              </div>

              <div className="auth__roles">
                <button
                  className={`auth__role-card ${role === 'student' ? 'auth__role-card--active' : ''}`}
                  onClick={() => handleRoleSelect('student')}
                >
                  <div className="auth__role-icon">🎓</div>
                  <div className="auth__role-title">Student</div>
                  <div className="auth__role-desc">Find verified tutors, book sessions, and get AI-powered summaries after every consultation.</div>
                  {role === 'student' && <div className="auth__role-check">✓</div>}
                </button>

                <button
                  className={`auth__role-card ${role === 'tutor' ? 'auth__role-card--active' : ''}`}
                  onClick={() => handleRoleSelect('tutor')}
                >
                  <div className="auth__role-icon">👨‍🏫</div>
                  <div className="auth__role-title">Tutor / Educator</div>
                  <div className="auth__role-desc">Showcase your credentials, manage your schedule, and build a trusted reputation.</div>
                  {role === 'tutor' && <div className="auth__role-check">✓</div>}
                </button>
              </div>

              <button className="auth__link" onClick={() => setMode('login')}>
                Already have an account? Sign in →
              </button>
            </div>
          )}

          {/* ── LOGIN ── */}
          {mode === 'login' && (
            <div className="auth__form anim-ready">
              <div className="auth__form-header">
                <Badge variant="yellow" dot>Welcome back</Badge>
                <h1 className="auth__form-title">Sign in to Convene</h1>
                <p className="auth__form-sub">Enter your credentials to access your dashboard.</p>
              </div>

              <button className="auth__google-btn">
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="auth__divider">
                <span>or continue with email</span>
              </div>

              <div className="auth__fields">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={setField('email')}
                  error={errors.email}
                  required
                  autoComplete="email"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  }
                />

                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={setField('password')}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  }
                  iconRight={
                    <button type="button" onClick={() => setShowPass(v => !v)} aria-label="Toggle password">
                      <EyeIcon open={showPass} />
                    </button>
                  }
                />
              </div>

              <div className="auth__row">
                <label className="auth__checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button className="auth__link auth__link--accent">Forgot password?</button>
              </div>

              {apiError && (
                <div className="auth__api-error">{apiError}</div>
              )}

              <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} loading={loading} type="button">
                Sign in
              </Button>

              <p className="auth__switch">
                Don't have an account?{' '}
                <button className="auth__link auth__link--accent" onClick={() => setMode('role')}>
                  Create account →
                </button>
              </p>
            </div>
          )}

          {/* ── SIGNUP ── */}
          {mode === 'signup' && (
            <div className="auth__form anim-ready">
              <div className="auth__form-header">
                <div className="auth__form-header-top">
                  <Badge variant={role === 'tutor' ? 'chain' : 'ai'} dot>
                    {role === 'tutor' ? 'Educator account' : 'Student account'}
                  </Badge>
                  <button className="auth__change-role" onClick={() => setMode('role')}>
                    Change role ↗
                  </button>
                </div>
                <h1 className="auth__form-title">Create your account</h1>
                <p className="auth__form-sub">
                  {role === 'tutor'
                    ? 'Set up your profile and highlight your credentials.'
                    : 'Join and find your perfect tutor through AI-powered matching.'}
                </p>
              </div>

              <button className="auth__google-btn">
                <GoogleIcon />
                Sign up with Google
              </button>

              <div className="auth__divider"><span>or fill in your details</span></div>

              <div className="auth__fields">
                <div className="auth__name-row">
                  <Input
                    label="First name"
                    placeholder="Juan"
                    value={form.firstName}
                    onChange={setField('firstName')}
                    error={errors.firstName}
                    required
                    autoComplete="given-name"
                  />
                  <Input
                    label="Last name"
                    placeholder="Dela Cruz"
                    value={form.lastName}
                    onChange={setField('lastName')}
                    error={errors.lastName}
                    required
                    autoComplete="family-name"
                  />
                </div>

                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={setField('email')}
                  error={errors.email}
                  required
                  autoComplete="email"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  }
                />

                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={setField('password')}
                  error={errors.password}
                  hint="Use at least 8 characters with a number or symbol"
                  required
                  autoComplete="new-password"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  }
                  iconRight={
                    <button type="button" onClick={() => setShowPass(v => !v)}>
                      <EyeIcon open={showPass} />
                    </button>
                  }
                />

                <Input
                  label="Confirm password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={setField('confirmPassword')}
                  error={errors.confirmPassword}
                  required
                  autoComplete="new-password"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  }
                  iconRight={
                    <button type="button" onClick={() => setShowConfirm(v => !v)}>
                      <EyeIcon open={showConfirm} />
                    </button>
                  }
                />
              </div>

              <PasswordStrength password={form.password} />

              <label className="auth__terms">
                <input type="checkbox" required />
                <span>
                  I agree to the{' '}
                  <button className="auth__link auth__link--accent">Terms of Service</button>
                  {' '}and{' '}
                  <button className="auth__link auth__link--accent">Privacy Policy</button>
                </span>
              </label>

              {apiError && (
                <div className="auth__api-error">{apiError}</div>
              )}

              <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} loading={loading} type="button">
                Create account
              </Button>

              <p className="auth__switch">
                Already have an account?{' '}
                <button className="auth__link auth__link--accent" onClick={() => setMode('login')}>
                  Sign in →
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Password strength indicator ── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const strength = password.length < 6 ? 1
    : password.length < 8 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
    : 3;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E'];
  return (
    <div className="pw-strength">
      <div className="pw-strength__bars">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className="pw-strength__bar"
            style={{ background: i <= strength ? colors[strength] : 'var(--ink-600)' }}
          />
        ))}
      </div>
      <span className="pw-strength__label" style={{ color: colors[strength] }}>
        {labels[strength]}
      </span>
    </div>
  );
}