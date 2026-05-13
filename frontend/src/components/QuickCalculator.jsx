import { useMemo, useState } from 'react';
import { LuCalculator, LuDelete, LuEqual, LuMinus, LuPlus, LuX } from 'react-icons/lu';

const buttons = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '(', ')'],
];

function evaluateExpression(expression) {
  const trimmed = expression.trim();
  if (!trimmed) return '';

  if (!/^[\d+\-*/().\s]+$/.test(trimmed)) {
    return 'Invalid expression';
  }

  try {
    const result = Function(`"use strict"; return (${trimmed})`)();
    if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
      return 'Invalid expression';
    }
    return result.toLocaleString('en-RW', { maximumFractionDigits: 2 });
  } catch {
    return 'Invalid expression';
  }
}

export default function QuickCalculator() {
  const [open, setOpen] = useState(false);
  const [expression, setExpression] = useState('');

  const result = useMemo(() => evaluateExpression(expression), [expression]);

  const append = (value) => setExpression((current) => `${current}${value}`);
  const clear = () => setExpression('');
  const backspace = () => setExpression((current) => current.slice(0, -1));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-2xl border border-[var(--auca-line)] bg-white px-4 py-3 text-sm font-bold text-[var(--auca-navy)] hover:bg-[var(--auca-paper)]"
        title="Quick calculator"
      >
        <LuCalculator className="h-4 w-4" />
        <span className="hidden sm:inline">Calculator</span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[320px] rounded-[28px] border border-[var(--auca-line)] bg-white p-4 shadow-[0_24px_60px_rgba(22,40,74,0.16)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-blue)]">
                Quick Calculator
              </p>
              <p className="mt-1 text-sm text-[var(--auca-muted)]">
                Do fast math without leaving the app.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-2xl bg-[var(--auca-paper)] p-2 text-[var(--auca-muted)] hover:text-[var(--auca-navy)]"
            >
              <LuX className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-[22px] bg-[var(--auca-paper)] p-4">
            <div className="min-h-[2rem] break-all text-right text-lg font-bold text-[var(--auca-navy)]">
              {expression || '0'}
            </div>
            <div className="mt-2 min-h-[1.5rem] text-right text-sm text-[var(--auca-muted)]">
              {result === '' ? 'Enter numbers and operators' : `= ${result}`}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <button
              onClick={clear}
              className="rounded-2xl bg-rose-50 px-3 py-3 text-sm font-bold text-rose-700 hover:bg-rose-100"
            >
              C
            </button>
            <button
              onClick={backspace}
              className="rounded-2xl bg-white px-3 py-3 text-sm font-bold text-[var(--auca-navy)] border border-[var(--auca-line)] hover:bg-[var(--auca-paper)]"
            >
              <LuDelete className="mx-auto h-4 w-4" />
            </button>
            <button
              onClick={() => append('%')}
              className="rounded-2xl bg-white px-3 py-3 text-sm font-bold text-[var(--auca-navy)] border border-[var(--auca-line)] hover:bg-[var(--auca-paper)] hidden"
            >
              %
            </button>
            <button
              onClick={() => append('+')}
              className="rounded-2xl bg-[rgba(241,182,28,0.18)] px-3 py-3 text-sm font-bold text-[var(--auca-navy)] hover:bg-[rgba(241,182,28,0.28)]"
            >
              <LuPlus className="mx-auto h-4 w-4" />
            </button>
            <button
              onClick={() => append('-')}
              className="rounded-2xl bg-[rgba(241,182,28,0.18)] px-3 py-3 text-sm font-bold text-[var(--auca-navy)] hover:bg-[rgba(241,182,28,0.28)]"
            >
              <LuMinus className="mx-auto h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 space-y-2">
            {buttons.map((row) => (
              <div key={row.join('')} className="grid grid-cols-4 gap-2">
                {row.map((value) => (
                  <button
                    key={value}
                    onClick={() => append(value)}
                    className={`rounded-2xl px-3 py-3 text-sm font-bold ${
                      ['/', '*', '-'].includes(value)
                        ? 'bg-[rgba(241,182,28,0.18)] text-[var(--auca-navy)] hover:bg-[rgba(241,182,28,0.28)]'
                        : 'border border-[var(--auca-line)] bg-white text-[var(--auca-ink)] hover:bg-[var(--auca-paper)]'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const computed = evaluateExpression(expression);
              if (computed !== '' && computed !== 'Invalid expression') {
                setExpression(String(computed).replace(/,/g, ''));
              }
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--auca-navy),var(--auca-blue))] px-4 py-3 text-sm font-bold text-white"
          >
            <LuEqual className="h-4 w-4" />
            Use Result
          </button>
        </div>
      )}
    </div>
  );
}
