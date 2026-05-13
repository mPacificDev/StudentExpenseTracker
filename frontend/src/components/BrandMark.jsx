export default function BrandMark({
  size = 'lg',
  subtitle = 'STUDENT FINANCE PORTAL',
  tone = 'dark',
}) {
  const sizeMap = {
    sm: {
      outer: 'h-11 w-11',
      title: 'text-lg',
      subtitle: 'text-[0.62rem]',
      gap: 'gap-3',
    },
    md: {
      outer: 'h-14 w-14',
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
  const titleTone = tone === 'light' ? 'text-white' : 'text-[var(--auca-navy)]';
  const subtitleTone = tone === 'light' ? 'text-white/70' : 'text-[var(--auca-blue)]';

  return (
    <div className={`flex items-center ${config.gap}`}>
      <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 shadow-[0_14px_30px_rgba(22,40,74,0.18)] ${config.outer}`}>
        <img
          src="/auca-logo.png"
          alt="AUCA logo"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className={`display-serif leading-none ${titleTone} ${config.title}`}>
          Student Expense Tracker
        </p>
        <p className={`mt-1 font-semibold tracking-[0.24em] uppercase ${subtitleTone} ${config.subtitle}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
