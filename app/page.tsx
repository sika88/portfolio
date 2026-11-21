import Icon from "@/components/icons";
import Hero from "@/components/hero";
import ProjectCard from "@/components/project-card";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import WhatsAppButton from "@/components/whatsapp-button";
import { PROCESS, PROJECTS, SERVICES, SITE, STACK, telLink } from "@/lib/content";

export default function Home() {
  const [featured, ...others] = PROJECTS;

  return (
    <>
      <Hero />

      <section id="work" className="container-page pt-24">
        <SectionHeading
          eyebrow="Selected work"
          title="Things I’ve built"
          text="Real projects, built end to end: design, database, payments and launch."
        />
        <div className="mt-12 space-y-6">
          <Reveal>
            <ProjectCard project={featured} featured />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="container-page pt-28">
        <SectionHeading eyebrow="What I do" title="Websites, shops and apps that earn their keep" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 120}>
              <div className="h-full rounded-3xl border border-border bg-surface p-7 transition hover:border-accent/50">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="process" className="container-page pt-28">
        <SectionHeading eyebrow="How we work" title="Simple, clear and out in the open" />
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 100} className="h-full">
                <div className="h-full rounded-3xl border border-border bg-surface p-6">
                  <p className="font-mono text-sm text-accent">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section id="about" className="container-page pt-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading eyebrow="About" title={`Hi, I’m ${SITE.name}`} />
            <Reveal delay={120}>
              <div className="mt-6 space-y-4 text-muted">
                <p>
                  I’m a {SITE.role} in {SITE.location}. I build websites and web apps for businesses that need to look professional, load fast, and
                  take orders and payments the way their customers actually pay: Mobile Money, cards and WhatsApp.
                </p>
                <p>
                  I like finishing the unglamorous parts properly: payments that can’t be double-counted, stock that can’t oversell, and admin
                  screens the owner can use on a phone.
                </p>
                <p>
                  I work in the open. You get a live preview link early, you own every account at the end, and you can reach me directly on WhatsApp.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="rounded-3xl border border-border bg-surface p-7">
              <h3 className="eyebrow">Toolbox</h3>
              <dl className="mt-5 space-y-5">
                {STACK.map((g) => (
                  <div key={g.group}>
                    <dt className="text-sm font-medium">{g.group}</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {g.items.map((i) => (
                        <span key={i} className="chip">
                          {i}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="container-page pt-28">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface p-8 sm:p-14">
            <div aria-hidden="true" className="drift absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
            <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />

            <p className="eyebrow">Let’s talk</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Need a website or an online shop? <span className="text-gradient">Message me.</span>
            </h2>
            <p className="mt-5 max-w-xl text-muted">
              Tell me what you sell, how your customers pay today, and any sites you like. I’ll reply with ideas and a clear way forward.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <WhatsAppButton message="Hello Sika! I saw your portfolio and I'd like to talk about a project.">WhatsApp {SITE.phoneDisplay}</WhatsAppButton>
              <a href={telLink} className="btn-outline">
                <Icon name="phone" />
                Call me
              </a>
              {SITE.email && (
                <a href={`mailto:${SITE.email}`} className="btn-outline">
                  <Icon name="mail" />
                  Email
                </a>
              )}
              {SITE.cvUrl && (
                <a href={SITE.cvUrl} className="btn-outline" download>
                  <Icon name="download" />
                  Download CV
                </a>
              )}
            </div>

            {SITE.social.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-5 text-sm">
                {SITE.social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted underline underline-offset-4 transition hover:text-accent">
                      {s.label}<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
