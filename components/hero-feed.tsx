const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const FEED = [
  { dot: "bg-accent", title: "New order · RA-7F3A", meta: "2 items · GHS 540.00", tag: "MoMo", d: 500 },
  { dot: "bg-green", title: "Payment confirmed", meta: "Order moved to processing", tag: "Paid", d: 1000 },
  { dot: "bg-sky-400", title: "SMS sent to the owner", meta: "“New order RA-7F3A…”", tag: "Sent", d: 1500 },
];

// A decorative demo of the order flow I build into shops
export default function HeroFeed() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
      <div className="drift absolute -inset-10 -z-10 rounded-full bg-accent/10 blur-3xl" />

      <div className="float-slow rounded-3xl border border-border bg-surface/80 p-5 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">orders · demo</span>
        </div>

        <ul className="mt-5 space-y-3">
          {FEED.map((f) => (
            <li key={f.title} className="pop-in flex items-center gap-3 rounded-2xl border border-border bg-surface-2 p-3.5" style={delay(f.d)}>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${f.dot}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{f.title}</span>
                <span className="block truncate text-xs text-muted">{f.meta}</span>
              </span>
              <span className="rounded-full bg-white/8 px-2.5 py-1 font-mono text-[11px] text-foreground/80">{f.tag}</span>
            </li>
          ))}
        </ul>

        <div className="pop-in mt-5 flex items-end gap-1.5 border-t border-border pt-5" style={delay(2000)}>
          {[34, 52, 40, 68, 58, 82, 74].map((h, i) => (
            <span key={i} className="flex-1 rounded-t bg-accent/70" style={{ height: `${h * 0.5}px` }} />
          ))}
        </div>
      </div>

      <span className="float-slow pop-in absolute -left-5 top-10 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-accent shadow-xl" style={delay(900)}>
        Paystack ✓
      </span>
      <span className="float-slow pop-in absolute -right-4 top-1/2 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs text-green shadow-xl" style={delay(1300)}>
        WhatsApp ✓
      </span>
    </div>
  );
}
