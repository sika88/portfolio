import Link from "next/link";
import { NAV, SITE, telLink, waLink } from "@/lib/content";

async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-border">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold">{SITE.name}</p>
          <p className="mt-1 text-sm text-muted">{SITE.business}</p>
          <p className="mt-4 max-w-xs text-sm text-muted">
            {SITE.role} in {SITE.location}. Websites, online shops and web apps for businesses.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={waLink("Hello! I saw your portfolio.")} target="_blank" rel="noopener noreferrer" className="text-muted transition hover:text-foreground">
                WhatsApp {SITE.phoneDisplay}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={telLink} className="text-muted transition hover:text-foreground">
                Call {SITE.phoneDisplay}
              </a>
            </li>
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className="text-muted transition hover:text-foreground">
                  {SITE.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="container-page py-5 text-xs text-muted">
          © <CurrentYear /> {SITE.name} · {SITE.business}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}