"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { resetContent, saveContent } from "@/app/admin/actions";
import type { SiteContent } from "@/lib/content";

type ProjectForm = {
  title: string;
  summary: string;
  stackText: string;
  live: string;
  code: string;
};
type Form = {
  profile: SiteContent["profile"];
  tagline: string;
  skillsText: string;
  servicesText: string;
  projects: ProjectForm[];
};
type Status = { kind: "idle" | "saving" | "ok" | "error"; msg?: string };

const lines = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);
const csv = (t: string) => t.split(",").map((s) => s.trim()).filter(Boolean);

function toForm(c: SiteContent): Form {
  return {
    profile: { ...c.profile },
    tagline: c.tagline,
    skillsText: c.skills.join("\n"),
    servicesText: c.services.join("\n"),
    projects: c.projects.map((p) => ({
      title: p.title,
      summary: p.summary,
      stackText: p.stack.join(", "),
      live: p.live,
      code: p.code,
    })),
  };
}

function toContent(f: Form): SiteContent {
  return {
    profile: f.profile,
    tagline: f.tagline,
    skills: lines(f.skillsText),
    services: lines(f.servicesText),
    projects: f.projects.map((p) => ({
      title: p.title,
      summary: p.summary,
      stack: csv(p.stackText),
      live: p.live,
      code: p.code,
    })),
  };
}

type ProfileKey = keyof Form["profile"];
const CONTACT_FIELDS: [ProfileKey, string, string][] = [
  ["email", "Email", "you@example.com"],
  ["whatsapp", "WhatsApp number", "0540245553 or 233540245553"],
  ["github", "GitHub URL", "https://github.com/your-name"],
  ["linkedin", "LinkedIn URL", "https://linkedin.com/in/your-name"],
];

function Field({
  label,
  wide,
  hint,
  children,
}: {
  label: string;
  wide?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`adm-field${wide ? " adm-field--wide" : ""}`}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export default function AdminEditor({ initial }: { initial: SiteContent }) {
  const [form, setForm] = useState<Form>(() => toForm(initial));
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const setProfile = (key: ProfileKey, value: string) =>
    setForm((f) => ({ ...f, profile: { ...f.profile, [key]: value } }));

  const setProject = (i: number, patch: Partial<ProjectForm>) =>
    setForm((f) => ({
      ...f,
      projects: f.projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));

  const moveProject = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const j = i + dir;
      if (j < 0 || j >= f.projects.length) return f;
      const next = [...f.projects];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...f, projects: next };
    });

  const removeProject = (i: number) => {
    if (!confirm("Delete this project?")) return;
    setForm((f) => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));
  };

  const addProject = () =>
    setForm((f) => ({
      ...f,
      projects: [
        ...f.projects,
        { title: "", summary: "", stackText: "", live: "", code: "" },
      ],
    }));

  async function save() {
    setStatus({ kind: "saving" });
    const res = await saveContent(toContent(form));
    if (res.ok && res.content) {
      setForm(toForm(res.content));
      setStatus({ kind: "ok", msg: "Saved. Your site is updated." });
    } else {
      setStatus({ kind: "error", msg: res.error ?? "Could not save." });
    }
  }

  async function reset() {
    if (!confirm("Reset everything to the original starter content?")) return;
    const res = await resetContent();
    if (res.ok && res.content) {
      setForm(toForm(res.content));
      setStatus({ kind: "ok", msg: "Reset to the starter content." });
    } else {
      setStatus({ kind: "error", msg: res.error ?? "Could not reset." });
    }
  }

  return (
    <>
      <header className="adm-top">
        <div className="adm-top__inner">
          <h1>Admin dashboard</h1>
          <a className="adm-btn" href="/" target="_blank" rel="noopener noreferrer">
            View site ↗
          </a>
          <button className="adm-btn" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </button>
        </div>
      </header>

      <main className="adm-main">
        <section className="adm-card">
          <h2>Profile &amp; hero</h2>
          <p className="adm-hint">
            To change your photo, right-click your avatar on the home page and
            choose Upload image.
          </p>
          <div className="adm-grid">
            <Field label="Full name">
              <input value={form.profile.name} onChange={(e) => setProfile("name", e.target.value)} />
            </Field>
            <Field label="Role / title">
              <input value={form.profile.role} onChange={(e) => setProfile("role", e.target.value)} />
            </Field>
            <Field label="Location">
              <input value={form.profile.location} onChange={(e) => setProfile("location", e.target.value)} />
            </Field>
            <Field label="Hero tagline" wide>
              <input
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              />
            </Field>
            <Field label="About me" wide>
              <textarea
                rows={5}
                value={form.profile.intro}
                onChange={(e) => setProfile("intro", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="adm-card">
          <h2>Contact</h2>
          <p className="adm-hint">
            The “Let’s talk” buttons open WhatsApp with this number. Leave a
            link empty to hide its icon.
          </p>
          <div className="adm-grid">
            {CONTACT_FIELDS.map(([key, label, placeholder]) => (
              <Field key={key} label={label}>
                <input
                  value={form.profile[key]}
                  placeholder={placeholder}
                  onChange={(e) => setProfile(key, e.target.value)}
                />
              </Field>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <h2>Skills</h2>
          <Field label="One skill per line" wide>
            <textarea
              rows={6}
              value={form.skillsText}
              onChange={(e) => setForm((f) => ({ ...f, skillsText: e.target.value }))}
            />
          </Field>
        </section>

        <section className="adm-card">
          <h2>What I offer</h2>
          <Field label="One item per line" wide>
            <textarea
              rows={5}
              value={form.servicesText}
              onChange={(e) => setForm((f) => ({ ...f, servicesText: e.target.value }))}
            />
          </Field>
        </section>

        <section className="adm-card">
          <h2>Projects</h2>
          {form.projects.map((p, i) => (
            <div className="adm-project" key={i}>
              <div className="adm-project__head">
                <strong>Project {i + 1}</strong>
                <button className="adm-btn adm-btn--icon" onClick={() => moveProject(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button className="adm-btn adm-btn--icon" onClick={() => moveProject(i, 1)} disabled={i === form.projects.length - 1} aria-label="Move down">↓</button>
                <button className="adm-btn adm-btn--danger" onClick={() => removeProject(i)}>Delete</button>
              </div>
              <div className="adm-grid">
                <Field label="Title" wide>
                  <input value={p.title} onChange={(e) => setProject(i, { title: e.target.value })} />
                </Field>
                <Field label="Summary" wide>
                  <textarea rows={3} value={p.summary} onChange={(e) => setProject(i, { summary: e.target.value })} />
                </Field>
                <Field label="Tech stack" wide hint="Separate with commas, e.g. Next.js, Drizzle, Neon">
                  <input value={p.stackText} onChange={(e) => setProject(i, { stackText: e.target.value })} />
                </Field>
                <Field label="Live site URL">
                  <input value={p.live} onChange={(e) => setProject(i, { live: e.target.value })} />
                </Field>
                <Field label="Source code URL">
                  <input value={p.code} onChange={(e) => setProject(i, { code: e.target.value })} />
                </Field>
              </div>
            </div>
          ))}
          <button className="adm-btn" style={{ marginTop: "1rem" }} onClick={addProject}>
            + Add project
          </button>
        </section>
      </main>

      <div className="adm-bar">
        <div className="adm-bar__inner">
          <span className={`adm-status adm-status--${status.kind}`} role="status">
            {status.kind === "saving" ? "Saving…" : (status.msg ?? "")}
          </span>
          <button className="adm-btn adm-btn--danger" onClick={reset}>
            Reset to starter
          </button>
          <button
            className="adm-btn adm-btn--primary"
            onClick={save}
            disabled={status.kind === "saving"}
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  );
}