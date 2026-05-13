import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuBell,
  LuDoorOpen,
  LuLockKeyhole,
  LuShieldCheck,
  LuTrash2,
  LuUserRound,
} from 'react-icons/lu';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

function SettingRow({ icon: Icon, title, note, action }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-[var(--auca-line)] bg-[var(--auca-paper)] px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--auca-blue)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-[var(--auca-ink)]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--auca-muted)]">{note}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AU';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6 fade-in">
        <section className="surface-panel rounded-[32px] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--auca-blue)]">Profile</p>
          <h2 className="mt-3 display-serif text-5xl leading-none text-[var(--auca-navy)] md:text-6xl">
            Account details and controls.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--auca-muted)] md:text-base">
            Review your identity, security posture, and account preferences from a cleaner profile surface.
          </p>
        </section>

        <section className="surface-card rounded-[30px] p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,var(--auca-blue),var(--auca-navy))] text-2xl font-extrabold text-white shadow-[0_18px_34px_rgba(33,58,107,0.24)]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--auca-blue)]">Account Identity</p>
              <h3 className="mt-3 display-serif text-4xl leading-none text-[var(--auca-navy)]">{user?.name}</h3>
              <p className="mt-3 text-sm text-[var(--auca-muted)]">{user?.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Active account
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">Full Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] px-4 py-3.5 text-sm text-[var(--auca-muted)]"
              />
            </div>
            <div>
              <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] px-4 py-3.5 text-sm text-[var(--auca-muted)]"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <div className="surface-card rounded-[30px] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--auca-blue)]">Session</p>
            <h3 className="mt-3 display-serif text-4xl leading-none text-[var(--auca-navy)]">Sign out</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--auca-muted)]">
              End your session on this device when you finish reviewing or updating your records.
            </p>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--auca-navy)] px-5 py-3 text-sm font-bold text-white"
            >
              <LuDoorOpen className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          <div className="rounded-[30px] border border-rose-200 bg-[linear-gradient(180deg,#fff7f7,#fff)] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-600">Danger Zone</p>
            <h3 className="mt-3 display-serif text-4xl leading-none text-rose-900">Delete account</h3>
            <p className="mt-4 text-sm leading-7 text-rose-700/80">
              Permanently remove your account and all associated records. This action is destructive and cannot be undone.
            </p>
            <button
              onClick={() => alert('Please contact support to delete your account.')}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white"
            >
              <LuTrash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {showLogoutConfirm && (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[30px] bg-white p-6 text-center shadow-[0_32px_70px_rgba(22,40,74,0.18)] fade-in">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] bg-[var(--auca-paper)] text-[var(--auca-navy)]">
              <LuUserRound className="h-7 w-7" />
            </div>
            <h3 className="display-serif text-4xl leading-none text-[var(--auca-navy)]">Sign out?</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--auca-muted)]">
              You will need to sign in again before accessing your records.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-2xl border border-[var(--auca-line)] px-4 py-3 text-sm font-bold text-[var(--auca-muted)]"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-2xl bg-[var(--auca-navy)] px-4 py-3 text-sm font-bold text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
