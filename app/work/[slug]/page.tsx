import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/icons";
import ProjectArt from "@/components/project-art";
import Reveal from "@/components/reveal";
import WhatsAppButton from "@/components/whatsapp-button";
import { PROJECTS, SITE } from "@/lib/content";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} | ${SITE.name}`, description: p.tagline },
  };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const p = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const facts = [
    { label: "Role", value: p.role },
    { label: "Year", value: p.year },
    { label: "Type", value: p.kind.split(" · ")[0] },
  ];

  return (
    <article className="container-page py-12 sm:py-16">
      <Link href="/#work" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground">
        <Icon name="arrow" className="h-4 w-4 rotate-180" />
        All work
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">{p.kind}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{p.title}</h1>
        <p className="mt-5 text-lg text-muted">{p.summary}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Visit the live site
              <Icon name="external" className="h-4 w-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <Icon name="code" className="h-4 w-4" />
              View the code
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </header>

      <Reveal>
        <ProjectArt project={p} className="mt-12 aspect-[16/8]" />
      </Reveal>

      <dl className="mt-10 grid gap-4 sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="rounded-2xl border border-border bg-surface p-5">
            <dt className="eyebrow">{f.label}</dt>
            <dd className="mt-2 font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <section>
            <h2 className="font-display text-2xl font-semibold">The challenge</h2>
            <p className="mt-4 text-muted">{p.challenge}</p>

            <h2 className="mt-12 font-display text-2xl font-semibold">What I built</h2>
            <ul className="mt-5 space-y-3">
              {p.built.map((b) => (
                <li key={b} className="flex items-start gap-3 text-muted">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-green" />
                  {b}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl font-semibold">Built with</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <section>
          <h2 className="font-display text-2xl font-semibold">Under the hood</h2>
          <ul className="mt-5 space-y-4">
            {p.technical.map((t, i) => (
              <li key={t.title}>
                <Reveal delay={i * 80}>
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                    <p className="mt-2 text-sm text-muted">{t.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-20 grid gap-5 sm:grid-cols-2">
        <Link href={`/work/${next.slug}`} className="group rounded-3xl border border-border bg-surface p-7 transition hover:border-accent/60">
          <p className="eyebrow">Next project</p>
          <p className="mt-3 font-display text-2xl font-semibold">{next.title}</p>
          <p className="mt-2 text-sm text-muted">{next.tagline}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            View case study <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </Link>
        <div className="rounded-3xl border border-border bg-surface-2 p-7">
          <p className="eyebrow">Your project</p>
          <p className="mt-3 font-display text-2xl font-semibold">Want something like this?</p>
          <p className="mt-2 text-sm text-muted">Tell me what you need and I’ll tell you how I’d build it.</p>
          <div className="mt-5">
            <WhatsAppButton message={`Hello Sika! I saw "${p.title}" on your portfolio and I'd like something similar.`}>Message me</WhatsAppButton>
          </div>
        </div>
      </div>
    </article>
  );
}
