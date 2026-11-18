import { TICKER } from "@/lib/content";

export default function Marquee() {
  const row = [...TICKER, ...TICKER];
  return (
    <div aria-hidden="true" className="marquee border-y border-border bg-surface/50 py-4">
      <div className="marquee-track">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-mono text-sm text-muted">
            <span className="px-8">{t}</span>
            <span className="text-xs text-accent/60">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
