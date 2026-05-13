import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuArrowRight,
  LuBadgeDollarSign,
  LuBookOpenText,
  LuCircleDollarSign,
  LuHandCoins,
  LuReceiptText,
  LuTrendingDown,
  LuTrendingUp,
} from 'react-icons/lu';
import Layout from '../components/Layout';
import dashboardService from '../services/dashboardService';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatters';

function InsightCard({ label, value, icon: Icon, accent, note }) {
  return (
    <div className="surface-card rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">{label}</p>
          <p className="mt-4 text-3xl font-extrabold text-[var(--auca-ink)]">{value}</p>
          <p className="mt-2 text-sm text-[var(--auca-muted)]">{note}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-[20px] ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      setError('Failed to load dashboard summary.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const currentBalance = summary?.currentBalance || 0;
  const totalTransactions = summary?.totalTransactions || 0;
  const spendingRatio = totalIncome > 0 ? Math.min(100, (totalExpenses / totalIncome) * 100) : 0;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((currentBalance / totalIncome) * 100)) : 0;

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <section className="surface-panel overflow-hidden rounded-[32px] p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--auca-blue)]">
                Overview
              </p>
              <h2 className="mt-3 display-serif text-5xl leading-none text-[var(--auca-navy)] md:text-6xl">
                {greeting()}, {summary?.userName || user?.name?.split(' ')[0]}.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--auca-muted)] md:text-base">
                Review your balance, spending pressure, and monthly discipline from a cleaner AUCA-centered dashboard.
              </p>
              <p className="mt-4 text-sm font-semibold text-[var(--auca-ink)]">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/transactions')}
                className="rounded-2xl bg-[linear-gradient(135deg,var(--auca-navy),var(--auca-blue))] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_34px_rgba(33,58,107,0.24)] hover:translate-y-[-1px]"
              >
                Add Transaction
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="rounded-2xl border border-[var(--auca-line)] bg-white px-5 py-3 text-sm font-bold text-[var(--auca-navy)] hover:bg-[var(--auca-paper)]"
              >
                Open Reports
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface-card h-40 animate-pulse rounded-[28px]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InsightCard
                label="Total Income"
                value={formatCurrency(totalIncome)}
                icon={LuTrendingUp}
                accent="bg-emerald-50 text-emerald-600"
                note="All recorded incoming funds"
              />
              <InsightCard
                label="Total Expenses"
                value={formatCurrency(totalExpenses)}
                icon={LuTrendingDown}
                accent="bg-rose-50 text-rose-600"
                note="Current recorded outflow"
              />
              <InsightCard
                label="Current Balance"
                value={formatCurrency(currentBalance)}
                icon={LuCircleDollarSign}
                accent="bg-[rgba(33,58,107,0.08)] text-[var(--auca-navy)]"
                note={currentBalance >= 0 ? 'Remaining available balance' : 'Spending has exceeded income'}
              />
              <InsightCard
                label="Transactions"
                value={`${totalTransactions}`}
                icon={LuReceiptText}
                accent="bg-[rgba(241,182,28,0.18)] text-[var(--auca-navy)]"
                note="Entries currently on record"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="surface-card rounded-[30px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--auca-blue)]">
                      Monthly Balance Lens
                    </p>
                    <h3 className="mt-3 display-serif text-4xl leading-none text-[var(--auca-navy)]">
                      Income versus spending
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-[rgba(241,182,28,0.18)] p-3 text-[var(--auca-navy)]">
                    <LuBadgeDollarSign className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-[var(--auca-ink)]">Expense pressure</span>
                      <span className="font-bold text-[var(--auca-navy)]">{spendingRatio.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[rgba(33,58,107,0.08)]">
                      <div
                        className="h-3 rounded-full bg-[linear-gradient(90deg,var(--auca-gold),#eb9f00)]"
                        style={{ width: `${spendingRatio}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-[var(--auca-ink)]">Savings rate</span>
                      <span className="font-bold text-emerald-600">{savingsRate.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[rgba(33,58,107,0.08)]">
                      <div
                        className="h-3 rounded-full bg-[linear-gradient(90deg,var(--auca-blue),var(--auca-navy))]"
                        style={{ width: `${Math.min(100, savingsRate)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] bg-[var(--auca-paper)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Income</p>
                      <p className="mt-2 text-xl font-extrabold text-emerald-600">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div className="rounded-[24px] bg-[var(--auca-paper)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Expenses</p>
                      <p className="mt-2 text-xl font-extrabold text-rose-600">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div className="rounded-[24px] bg-[var(--auca-paper)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Net</p>
                      <p className={`mt-2 text-xl font-extrabold ${currentBalance >= 0 ? 'text-[var(--auca-navy)]' : 'text-rose-600'}`}>
                        {formatCurrency(currentBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="surface-card rounded-[30px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--auca-blue)]">
                      Quick Actions
                    </p>
                    <h3 className="mt-3 display-serif text-4xl leading-none text-[var(--auca-navy)]">
                      Keep the month organized
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-[rgba(33,58,107,0.08)] p-3 text-[var(--auca-navy)]">
                    <LuBookOpenText className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    {
                      title: 'Record income',
                      note: 'Scholarship, support, salary, or other incoming funds.',
                      icon: LuHandCoins,
                      action: () => navigate('/transactions'),
                    },
                    {
                      title: 'Log expense',
                      note: 'Housing, food, transport, tuition support, or supplies.',
                      icon: LuReceiptText,
                      action: () => navigate('/transactions'),
                    },
                    {
                      title: 'Review reports',
                      note: 'Check category distribution and monthly balance trends.',
                      icon: LuArrowRight,
                      action: () => navigate('/reports'),
                    },
                  ].map(({ title, note, icon: Icon, action }) => (
                    <button
                      key={title}
                      onClick={action}
                      className="flex w-full items-center justify-between rounded-[24px] border border-[var(--auca-line)] bg-[var(--auca-paper)] px-4 py-4 text-left hover:bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--auca-blue)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--auca-ink)]">{title}</p>
                          <p className="mt-1 text-sm leading-6 text-[var(--auca-muted)]">{note}</p>
                        </div>
                      </div>
                      <LuArrowRight className="h-5 w-5 shrink-0 text-[var(--auca-muted)]" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
