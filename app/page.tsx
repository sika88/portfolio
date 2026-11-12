import SiteHeader from "@/components/SiteHeader";
import CurrentYear from "@/components/CurrentYear";
import HeroPhoto from "@/components/HeroPhoto";
import { profile, projects, skills, services } from "@/lib/data";

type SkillLike = string | { name?: string; title?: string; label?: string };

const skillNames = (Array.isArray(skills) ? (skills as unknown as SkillLike[]) : [])
  .map((s) => (typeof s === "string" ? s : (s.name ?? s.title ?? s.label ?? "")))
  .filter(Boolean);

const stackList = Array.from(new Set(projects.flatMap((p) => p.stack))).slice(0, 5);

const codeSample = `const developer = {
  name: ${JSON.stringify(profile.name)},
  location: ${JSON.stringify(profile.location)},
  stack: ${JSON.stringify(stackList)},
  openToWork: true,
};`;

export default function Home() {
  return (
    <div className="pf" id="top">
      <SiteHeader name={profile.name} />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="pf-hero pf-container">
          <div className="pf-hero__text">
            <p className="pf-pill">Based in {profile.location}</p>
            <h1>
              Hi, I’m <span className="pf-grad">{profile.name}</span>
            </h1>
            <p className="pf-lead">
              {profile.role} building modern web solutions.
            </p>
            <div className="pf-actions">
              <a className="pf-btn pf-btn--primary" href="#projects">
                View my work <span aria-hidden="true">→</span>
              </a>
              <a className="pf-btn pf-btn--ghost" href={`mailto:${profile.email}`}>
                Let’s talk
              </a>
            </div>
          </div>
          <HeroPhoto name={profile.name} />
        </section>

        {/* ---------- About ---------- */}
        <section id="about" className="pf-section pf-container" aria-labelledby="about-title">
          <h2 id="about-title" className="pf-h2">
            About <span className="pf-grad">Me</span>
          </h2>
          <div className="pf-about">
            <div>
              <p className="pf-about__text">{profile.intro}</p>
              <ul className="pf-tags">
                {services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="pf-code" aria-hidden="true">
              <div className="pf-code__bar">
                <span />
                <span />
                <span />
              </div>
              <pre>
                <code>{codeSample}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ---------- Skills ---------- */}
        <section id="skills" className="pf-section pf-container" aria-labelledby="skills-title">
          <h2 id="skills-title" className="pf-h2">
            My <span className="pf-grad">Skills</span>
          </h2>
          <ul className="pf-skills">
            {skillNames.map((name) => (
              <li key={name} className="pf-skill">
                <span className="pf-skill__badge">{name.slice(0, 2)}</span>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Projects ---------- */}
        <section id="projects" className="pf-section pf-container" aria-labelledby="projects-title">
          <div className="pf-section__head">
            <h2 id="projects-title" className="pf-h2">
              My <span className="pf-grad">Projects</span>
            </h2>
            <a
              className="pf-link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              View all →
            </a>
          </div>
          <div className="pf-projects">
            {projects.map((p, i) => (
              <article key={p.title} className="pf-card">
                <div className="pf-card__banner" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <ul className="pf-chips">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="pf-card__links">
                  {p.live ? (
                    <a href={p.live} target="_blank" rel="noopener noreferrer">
                      Live site ↗
                    </a>
                  ) : (
                    <span className="pf-muted">In progress</span>
                  )}
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noopener noreferrer">
                      Source code ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="pf-section pf-container" aria-labelledby="contact-title">
          <h2 id="contact-title" className="pf-h2">
            Contact <span className="pf-grad">Me</span>
          </h2>
          <div className="pf-contact">
            <ul className="pf-social">
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} aria-label="Email">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
              </li>
            </ul>
            <a className="pf-btn pf-btn--ghost" href={`mailto:${profile.email}`}>
              Let’s talk
            </a>
          </div>
        </section>
      </main>

      <footer className="pf-footer pf-container">
        <span>
          © <CurrentYear /> {profile.name}
        </span>
        <a href="/signin">Admin</a>
      </footer>
    </div>
  );
}