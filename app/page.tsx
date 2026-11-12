import SiteHeader from "@/components/SiteHeader";
import CurrentYear from "@/components/CurrentYear";
import { profile, projects, skills, services } from "@/lib/data";

export default function Home() {
  return (
    <>
      <div className="stripe" aria-hidden="true" />
    <SiteHeader name={profile.name} />
      <main className="wrap">
        <header className="hero">
          <p className="where">{profile.role} in {profile.location}</p>
          <h1>{profile.name}</h1>
          <p className="intro">{profile.intro}</p>
          <p className="links">
            <a href={`mailto:${profile.email}`}>Email me</a>
            <a href={profile.github}>GitHub</a>
            <a href={profile.linkedin}>LinkedIn</a>
          </p>
        </header>

        <section aria-labelledby="work">
          <h2 id="work">Projects</h2>
          {projects.map((p) => (
            <article className="row" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <p className="stack">{p.stack.join(", ")}</p>
              <p className="links">
                {p.live ? <a href={p.live}>Live site</a> : <span className="soon">In progress</span>}
                {p.code && <a href={p.code}>Source code</a>}
              </p>
            </article>
          ))}
        </section>

        <section aria-labelledby="skills">
          <h2 id="skills">Skills</h2>
          <dl>
            {skills.map((s) => (
              <div className="row skill" key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="hire">
          <h2 id="hire">Work with me</h2>
          <ul>
            {services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="cta">
            <a href={`mailto:${profile.email}`}>Tell me about your project</a>
          </p>
        </section>

        <footer>© <CurrentYear /> {profile.name} · <a href="/api/auth/signin">Admin</a></footer>
      </main>
    </>
  );
}
