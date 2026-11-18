import Link from "next/link";
import HeroFeed from "@/components/hero-feed";
import Icon from "@/components/icons";
import WhatsAppButton from "@/components/whatsapp-button";
import { SITE } from "@/lib/content";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const TRUST = ["Paystack and Mobile Money", "Live preview links as we build", "You own every account"];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />

      <div className="container-page grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div>
          {SITE.available && (
            <p className="fade-up inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-sm" style={delay(0)}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
              </span>
              Available for new projects
            </p>
          )}

          <h1 className="fade-up mt-7 font-display text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl" style={delay(120)}>
            I build fast websites and online shops for <span className="text-gradient">businesses in Ghana.</span>
          </h1>

          <p className="fade-up mt-6 max-w-xl text-lg text-muted" style={delay(260)}>
            I’m {SITE.name}, a {SITE.role}. Mobile Money, Paystack, WhatsApp orders, admin dashboards: built to work the way your customers actually pay.
          </p>

          <div className="fade-up mt-9 flex flex-wrap gap-3" style={delay(400)}>
            <Link href="/#work" className="btn-primary">
              See my work
              <Icon name="arrow" />
            </Link>
            <WhatsAppButton
              className="btn-outline"
              message="Hello Sika! I saw your portfolio and I'd like to talk about a project."
            >
              Chat on WhatsApp
            </WhatsAppButton>
          </div>

          <ul className="fade-up mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted" style={delay(540)}>
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-accent" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroFeed />
      </div>
    </section>
  );
}
