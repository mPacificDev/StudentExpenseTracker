import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuArrowRight, LuEye, LuEyeOff, LuKeyRound, LuShieldCheck, LuWallet } from 'react-icons/lu';
import { HiOutlineMail } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import AuthShell from '../components/AuthShell';

const highlights = [
  {
    title: 'Institutional Identity',
    description: 'A refined AUCA-inspired experience built around credibility, clarity, and academic professionalism.',
    icon: <LuShieldCheck className="h-5 w-5" />,
  },
  {
    title: 'Daily Visibility',
    description: 'Track transport, meals, housing, and academic costs without losing the monthly picture.',
    icon: <LuWallet className="h-5 w-5" />,
  },
];

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">
      {children}
    </label>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      login({ id: response.id, name: response.name, email: response.email }, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Secure Student Access"
      title="Manage your finances with discipline."
      subtitle="Access a cleaner financial dashboard tailored for the AUCA case study, with a stronger institutional tone and a sharper daily workflow."
      highlights={highlights}
      footer={(
        <p className="mt-6 text-center text-sm text-[var(--auca-muted)]">
          New here?{' '}
          <Link to="/register" className="font-bold text-[var(--auca-blue)] hover:text-[var(--auca-navy)]">
            Create your account
          </Link>
        </p>
      )}
    >
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--auca-blue)]">
          Sign In
        </p>
        <h2 className="mt-3 display-serif text-5xl leading-none text-[var(--auca-navy)]">
          Welcome back
        </h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-[var(--auca-muted)]">
          Use your student finance account to review reports, log transactions, and keep your spending under control.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            <LuKeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auca-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="soft-ring w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] py-3.5 pl-12 pr-12 text-sm text-[var(--auca-ink)]"
              placeholder="Enter your password"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--auca-navy),var(--auca-blue))] px-4 py-3.5 text-sm font-bold text-white shadow-[0_18px_34px_rgba(33,58,107,0.24)] hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-white" />
              Signing in...
            </>
          ) : (
            <>
              Continue to dashboard
              <LuArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
