import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-shell flex h-screen items-center justify-center px-4">
        <div className="surface-panel rounded-[28px] px-8 py-7 text-center">
          <div className="mx-auto mb-4 h-3 w-3 rounded-full bg-[var(--auca-gold)] pulse-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--auca-blue)]">
            Secure Access
          </p>
          <p className="mt-3 display-serif text-4xl leading-none text-[var(--auca-navy)]">
            Loading workspace
          </p>
          <p className="mt-3 text-sm text-[var(--auca-muted)]">
            Preparing your student finance dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
