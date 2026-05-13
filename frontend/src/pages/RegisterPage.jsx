import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LuArrowRight,
  LuBadgeCheck,
  LuBookOpenText,
  LuEye,
  LuEyeOff,
  LuLockKeyhole,
  LuShieldCheck,
  LuUserRound,
} from 'react-icons/lu';
import { HiOutlineMail } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import AuthShell from '../components/AuthShell';

const highlights = [
  {
    title: 'Case Study Ready',
    description: 'A more grounded institutional presentation aligned with AUCA rather than a generic finance app style.',
    icon: <LuBookOpenText className="h-5 w-5" />,
  },
  {
    title: 'Protected Records',
    description: 'Authentication remains secure while the interface becomes more credible, polished, and easier to trust.',
    icon: <LuShieldCheck className="h-5 w-5" />,
  },
];

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">
      {children}
    </label>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      register({ id: response.id, name: response.name, email: response.email }, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    if (!formData.password) return null;
    if (formData.password.length < 6) return { label: 'Weak', width: '34%', tone: 'bg-rose-500', text: 'text-rose-600' };
    if (formData.password.length < 10) return { label: 'Moderate', width: '68%', tone: 'bg-[var(--auca-gold)]', text: 'text-[var(--auca-navy)]' };
    return { label: 'Strong', width: '100%', tone: 'bg-emerald-500', text: 'text-emerald-600' };
  })();

  return (
    <AuthShell
      eyebrow="Create Student Access"
      title="Open your personal finance workspace."
      subtitle="Register once and keep a disciplined record of spending, category trends, and monthly balance through a stronger campus-branded experience."
      highlights={highlights}
      footer={(
        <p className="mt-6 text-center text-sm text-[var(--auca-muted)]">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[var(--auca-blue)] hover:text-[var(--auca-navy)]">
            Sign in instead
          </Link>
        </p>
      )}
    >
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--auca-blue)]">
          Register
        </p>
        <h2 className="mt-3 display-serif text-5xl leading-none text-[var(--auca-navy)]">
          Create account
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--auca-muted)]">
          Set up your account to start recording income, daily expenses, and reports in a cleaner AUCA-focused dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <div className="relative">
            <LuUserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auca-muted)]" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="soft-ring w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] py-3.5 pl-12 pr-4 text-sm text-[var(--auca-ink)]"
              placeholder="Your full name"
              required
            />
          </div>
        </div>

        <div>
          <FieldLabel>Email Address</FieldLabel>
          <div className="relative">
            <HiOutlineMail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auca-muted)]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="soft-ring w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] py-3.5 pl-12 pr-4 text-sm text-[var(--auca-ink)]"
              placeholder="your.name@auca.ac.rw"
              required
            />
          </div>
        </div>

        <div>
          <FieldLabel>Password</FieldLabel>
          <div className="relative">
            <LuLockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auca-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="soft-ring w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] py-3.5 pl-12 pr-12 text-sm text-[var(--auca-ink)]"
              placeholder="Minimum 6 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--auca-muted)] hover:text-[var(--auca-navy)]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
            </button>
          </div>
          {strength && (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Password strength</span>
                <span className={`font-bold ${strength.text}`}>{strength.label}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(33,58,107,0.08)]">
                <div className={`h-2 rounded-full ${strength.tone}`} style={{ width: strength.width }} />
              </div>
            </div>
          )}
        </div>

        <div>
          <FieldLabel>Confirm Password</FieldLabel>
          <div className="relative">
            <LuBadgeCheck className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auca-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`soft-ring w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm text-[var(--auca-ink)] ${
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'border-rose-300 bg-rose-50'
                  : 'border-[var(--auca-line)] bg-[var(--auca-paper)]'
              }`}
              placeholder="Repeat your password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--auca-navy),var(--auca-blue))] px-4 py-3.5 text-sm font-bold text-white shadow-[0_18px_34px_rgba(33,58,107,0.24)] hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-white" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <LuArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
