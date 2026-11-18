import Link from "next/link";
import MobileNav from "@/components/mobile-nav";
import { INITIALS, NAV, SITE } from "@/lib/content";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div aria-hidden="true" className="kente" />
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-sm font-bold text-background">
            {INITIALS}
          </span>
          <span className="font-display text-base font-semibold tracking-tight">{SITE.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted transition hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#contact" className="btn-primary btn-sm hidden sm:inline-flex">
            Hire me
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
