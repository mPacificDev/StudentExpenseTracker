import BrandMark from './BrandMark';

export default function AuthShell({
  title,
  subtitle,
  eyebrow,
  highlights,
  children,
  footer,
}) {
  return (
    <div className="auth-stage auth-grid relative overflow-hidden px-4 py-6 md:px-8">
      <div className="absolute inset-0 hero-grid opacity-40" />
      <div className="absolute -left-16 top-14 h-48 w-48 rounded-full bg-[rgba(241,182,28,0.22)] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.10)] blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/6 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur md:grid-cols-[1.08fr_0.92fr]">
        <section className="auth-panel-copy flex flex-col justify-between p-8 text-white md:p-12">
          <div className="space-y-8">
            <BrandMark size="md" subtitle="AUCA CASE STUDY" />
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--auca-gold-soft)]">
                {eyebrow}
              </p>
              <h1 className="display-serif text-5xl leading-[0.95] md:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/78 md:text-base">
                {subtitle}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[26px] border border-white/10 bg-white/8 p-5"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(241,182,28,0.18)] text-[var(--auca-gold-soft)]">
                    {item.icon}
                  </div>
                  <h2 className="mb-2 text-base font-bold">{item.title}</h2>
                  <p className="text-sm leading-6 text-white/72">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/62">
            <span className="rounded-full border border-white/12 px-3 py-2">Kigali Campus</span>
            <span className="rounded-full border border-white/12 px-3 py-2">Secure Access</span>
            <span className="rounded-full border border-white/12 px-3 py-2">Student Finance Records</span>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[linear-gradient(180deg,rgba(247,244,236,0.98),rgba(255,255,255,0.94))] p-5 md:p-10">
          <div className="w-full max-w-xl rounded-[30px] border border-[var(--auca-line)] bg-white px-6 py-7 shadow-[0_24px_60px_rgba(22,40,74,0.12)] md:px-8 md:py-9">
            {children}
            {footer}
          </div>
        </section>
      </div>
    </div>
  );
}
