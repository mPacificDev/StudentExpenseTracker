export function formatCurrency(amount) {
  const value = Number(amount || 0);

  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSignedCurrency(amount) {
  const value = Number(amount || 0);
  const formatted = formatCurrency(Math.abs(value));

  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}
