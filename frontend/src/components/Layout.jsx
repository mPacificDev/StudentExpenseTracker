import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LuBadgeDollarSign,
  LuChartColumnBig,
  LuChevronLeft,
  LuChevronRight,
  LuCircleUserRound,
  LuDoorOpen,
  LuLayoutDashboard,
  LuReceipt,
} from 'react-icons/lu';
import { useAuth } from '../hooks/useAuth';
import BrandMark from './BrandMark';
import QuickCalculator from './QuickCalculator';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: LuReceipt },
  { path: '/reports', label: 'Reports', icon: LuChartColumnBig },
  { path: '/profile', label: 'Profile', icon: LuCircleUserRound },
];

function StatusPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AU';

  const currentSection = navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell flex min-h-screen">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 self-start overflow-hidden bg-[linear-gradient(180deg,var(--auca-navy-strong),var(--auca-navy))] text-white lg:flex lg:flex-col ${
          collapsed ? 'lg:w-[112px]' : 'lg:w-[320px]'
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(241,182,28,0.18),transparent_60%)]" />

        <div className="relative flex items-center justify-between px-6 py-7">
          {!collapsed ? (
            <BrandMark size="sm" subtitle="STUDENT FINANCE PORTAL" tone="light" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 shadow-[0_14px_30px_rgba(22,40,74,0.18)]">
              <img
                src="/auca-logo.png"
                alt="AUCA logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white/70 hover:bg-white/14 hover:text-white"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <LuChevronRight className="h-5 w-5" /> : <LuChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="relative mt-6 flex-1 px-4">
          <div className="space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  title={collapsed ? label : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    active ? 'nav-active' : 'nav-idle text-white/72'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="relative border-t border-white/10 px-4 py-4">
          <div
            className={`rounded-[26px] border border-white/10 bg-white/8 ${
              collapsed ? 'px-3 py-4' : 'px-4 py-4'
            }`}
          >
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--auca-gold),#f4cc58)] font-bold text-[var(--auca-navy-strong)]">
                {initials}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{user?.name}</p>
                  <p className="truncate text-xs text-white/58">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              title={collapsed ? 'Sign out' : undefined}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 px-4 py-3 text-sm font-semibold text-white/84 hover:bg-white/10 ${
                collapsed ? 'px-0' : ''
              }`}
            >
              <LuDoorOpen className="h-4 w-4" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--auca-line)] bg-[rgba(248,246,241,0.84)] backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--auca-blue)]">
                Adventist University of Central Africa
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="display-serif text-3xl leading-none text-[var(--auca-navy)]">
                  {currentSection}
                </h1>
                <span className="rounded-full bg-[rgba(241,182,28,0.18)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--auca-navy)]">
                  Student Finance
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <QuickCalculator />
              <div className="hidden rounded-[24px] border border-[var(--auca-line)] bg-white/70 px-4 py-2 text-right sm:block">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--auca-muted)]">Current User</p>
                <p className="mt-1 text-sm font-bold text-[var(--auca-navy)]">{user?.name}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--auca-blue),var(--auca-navy))] font-bold text-white shadow-[0_14px_28px_rgba(33,58,107,0.2)]">
                {initials}
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--auca-line)] lg:hidden">
            <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
              {navItems.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap ${
                      active
                        ? 'bg-[var(--auca-navy)] text-white'
                        : 'border border-[var(--auca-line)] bg-white text-[var(--auca-muted)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
