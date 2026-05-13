import { useEffect, useState } from 'react';
import {
  LuBadgeDollarSign,
  LuCalendarRange,
  LuChartColumnBig,
  LuCircleDollarSign,
  LuTrendingDown,
  LuTrendingUp,
} from 'react-icons/lu';
import Layout from '../components/Layout';
import transactionService from '../services/transactionService';
import { formatCurrency } from '../utils/formatters';

const BAR_COLORS = [
  'bg-[var(--auca-blue)]',
  'bg-[var(--auca-navy)]',
  'bg-[var(--auca-gold)]',
  'bg-emerald-500',
  'bg-rose-500',
];

function SummaryCard({ label, value, note, icon: Icon, accent }) {
  return (
    <div className="surface-card rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--auca-muted)]">{label}</p>
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

function ProgressRow({ name, amount, percentage, index, positive = false }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${BAR_COLORS[index % BAR_COLORS.length]}`} />
          <span className="text-sm font-semibold text-[var(--auca-ink)]">{name}</span>
        </div>
        <div className="text-right">
          <span className={`text-sm font-bold ${positive ? 'text-emerald-600' : 'text-[var(--auca-navy)]'}`}>
            {formatCurrency(amount)}
          </span>
          <span className="ml-2 text-xs font-semibold text-[var(--auca-muted)]">{percentage.toFixed(0)}%</span>
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(33,58,107,0.08)]">
        <div className={`h-2.5 rounded-full ${positive ? 'bg-emerald-500' : BAR_COLORS[index % BAR_COLORS.length]}`} style={{ width: `${Math.min(100, percentage)}%` }} />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAll();
      setTransactions(data.filter((transaction) => transaction.transactionDate.startsWith(selectedMonth)));
    } catch (err) {
      setError('Failed to load transactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'INCOME')
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

  const balance = totalIncome - totalExpenses;
  const categoryBreakdown = transactions.reduce((accumulator, transaction) => {
    const key = transaction.categoryName;
    if (!accumulator[key]) accumulator[key] = { amount: 0, count: 0, type: transaction.type };
    accumulator[key].amount += parseFloat(transaction.amount);
    accumulator[key].count += 1;
    return accumulator;
  }, {});

  const categories = Object.entries(categoryBreakdown).map(([name, data]) => ({ name, ...data }));
  const expenseCategories = categories.filter((entry) => entry.type === 'EXPENSE').sort((a, b) => b.amount - a.amount);
  const incomeCategories = categories.filter((entry) => entry.type === 'INCOME').sort((a, b) => b.amount - a.amount);
  const savingsRate = totalIncome > 0 ? Math.max(0, (balance / totalIncome) * 100) : 0;
  const expensePressure = totalIncome > 0 ? Math.min(100, (totalExpenses / totalIncome) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <section className="surface-panel rounded-[32px] p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--auca-blue)]">
                Reports & Analytics
              </p>
              <h2 className="mt-3 display-serif text-5xl leading-none text-[var(--auca-navy)] md:text-6xl">
                Understand the month with more precision.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--auca-muted)] md:text-base">
                Review category pressure, income contribution, and monthly balance from one institutional-looking report view.
              </p>
            </div>
            <div className="rounded-[26px] border border-[var(--auca-line)] bg-white px-4 py-3">
              <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">
                Report Month
              </label>
              <div className="flex items-center gap-3">
                <LuCalendarRange className="h-5 w-5 text-[var(--auca-blue)]" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="soft-ring rounded-xl border border-[var(--auca-line)] bg-[var(--auca-paper)] px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="surface-card h-36 animate-pulse rounded-[28px]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SummaryCard
                label="Total Income"
                value={formatCurrency(totalIncome)}
                note={`${transactions.filter((transaction) => transaction.type === 'INCOME').length} income entries`}
                icon={LuTrendingUp}
                accent="bg-emerald-50 text-emerald-600"
              />
              <SummaryCard
                label="Total Expenses"
                value={formatCurrency(totalExpenses)}
                note={`${transactions.filter((transaction) => transaction.type === 'EXPENSE').length} expense entries`}
                icon={LuTrendingDown}
                accent="bg-rose-50 text-rose-600"
              />
              <SummaryCard
                label="Net Balance"
                value={formatCurrency(balance)}
                note={`Savings rate ${savingsRate.toFixed(0)}%`}
                icon={LuCircleDollarSign}
                accent="bg-[rgba(241,182,28,0.16)] text-[var(--auca-navy)]"
              />
            </div>

            <section className="surface-card rounded-[30px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--auca-blue)]">
                    Monthly Indicators
                  </p>
                  <h3 className="mt-3 display-serif text-4xl leading-none text-[var(--auca-navy)]">
                    Spending pressure and resilience
                  </h3>
                </div>
                <div className="rounded-2xl bg-[rgba(33,58,107,0.08)] p-3 text-[var(--auca-navy)]">
                  <LuBadgeDollarSign className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--auca-ink)]">Expense pressure</span>
                    <span className="font-bold text-[var(--auca-navy)]">{expensePressure.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[rgba(33,58,107,0.08)]">
                    <div className="h-3 rounded-full bg-[linear-gradient(90deg,var(--auca-gold),#eb9f00)]" style={{ width: `${expensePressure}%` }} />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--auca-ink)]">Savings rate</span>
                    <span className="font-bold text-emerald-600">{savingsRate.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[rgba(33,58,107,0.08)]">
                    <div className="h-3 rounded-full bg-[linear-gradient(90deg,var(--auca-blue),var(--auca-navy))]" style={{ width: `${Math.min(100, savingsRate)}%` }} />
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <section className="surface-card rounded-[30px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--auca-blue)]">Expense Distribution</p>
                    <h3 className="mt-3 display-serif text-4xl leading-none text-[var(--auca-navy)]">Where money goes</h3>
                  </div>
                  <div className="rounded-2xl bg-[rgba(241,182,28,0.16)] p-3 text-[var(--auca-navy)]">
                    <LuChartColumnBig className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  {expenseCategories.length === 0 ? (
                    <p className="text-sm leading-7 text-[var(--auca-muted)]">No expenses recorded for this month.</p>
                  ) : (
                    expenseCategories.slice(0, 6).map((entry, index) => (
                      <ProgressRow
                        key={entry.name}
                        name={entry.name}
                        amount={entry.amount}
                        percentage={(entry.amount / (totalExpenses || 1)) * 100}
                        index={index}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="surface-card rounded-[30px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--auca-blue)]">Income Distribution</p>
                    <h3 className="mt-3 display-serif text-4xl leading-none text-[var(--auca-navy)]">Where money comes from</h3>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                    <LuTrendingUp className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  {incomeCategories.length === 0 ? (
                    <p className="text-sm leading-7 text-[var(--auca-muted)]">No income recorded for this month.</p>
                  ) : (
                    incomeCategories.slice(0, 6).map((entry, index) => (
                      <ProgressRow
                        key={entry.name}
                        name={entry.name}
                        amount={entry.amount}
                        percentage={(entry.amount / (totalIncome || 1)) * 100}
                        index={index}
                        positive
                      />
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
