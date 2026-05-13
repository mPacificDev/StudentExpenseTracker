export default function BrandMark({ size = 'lg', subtitle = 'STUDENT FINANCE PORTAL' }) {
  const sizeMap = {
    sm: {
      outer: 'w-11 h-11 text-[0.72rem]',
      title: 'text-lg',
      subtitle: 'text-[0.62rem]',
      gap: 'gap-3',
    },
    md: {
      outer: 'w-14 h-14 text-[0.84rem]',
      title: 'text-[1.45rem]',
      subtitle: 'text-[0.68rem]',
      gap: 'gap-3.5',
    },
    lg: {
      outer: 'h-[4.5rem] w-[4.5rem] text-[1rem]',
      title: 'text-[1.85rem]',
      subtitle: 'text-[0.74rem]',
      gap: 'gap-4',
    },
  };

  const config = sizeMap[size] || sizeMap.lg;

  return (
    <div className={`flex items-center ${config.gap}`}>
      <div className={`brand-mark ${config.outer} shrink-0 font-extrabold tracking-[0.28em]`}>
        AU
      </div>
      <div className="min-w-0">
        <p className={`display-serif leading-none text-[var(--auca-navy)] ${config.title}`}>
          Student Expense Tracker
        </p>
        <p className={`mt-1 font-semibold tracking-[0.24em] text-[var(--auca-blue)] uppercase ${config.subtitle}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
