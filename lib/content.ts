import { cacheLife, cacheTag } from "next/cache";
import { getSql } from "@/lib/avatar-db";
import {
  profile as p0,
  projects as projects0,
  skills as skills0,
  services as services0,
} from "@/lib/data";

export type Project = {
  title: string;
  summary: string;
  stack: string[];
  live: string;
  code: string;
};

export type SiteContent = {
  profile: {
    name: string;
    role: string;
    location: string;
    intro: string;
    email: string;
    github: string;
    linkedin: string;
    whatsapp: string;
  };
  tagline: string;
  skills: string[];
  services: string[];
  projects: Project[];
};

type SkillLike = string | { name?: string; title?: string; label?: string };
const str = (v: unknown) => (typeof v === "string" ? v : "");

export const DEFAULTS: SiteContent = {
  profile: {
    name: str(p0.name),
    role: str(p0.role),
    location: str(p0.location),
    intro: str(p0.intro),
    email: str(p0.email),
    github: str(p0.github),
    linkedin: str(p0.linkedin),
    whatsapp: "0540245553",
  },
  tagline: `${str(p0.role)} building modern web solutions.`,
  skills: (Array.isArray(skills0) ? (skills0 as unknown as SkillLike[]) : [])
    .map((s) => (typeof s === "string" ? s : (s.name ?? s.title ?? s.label ?? "")))
    .filter(Boolean),
  services: Array.isArray(services0) ? services0.map((s) => str(s)).filter(Boolean) : [],
  projects: projects0.map((p) => ({
    title: str(p.title),
    summary: str(p.summary),
    stack: Array.isArray(p.stack) ? p.stack.map((s) => str(s)).filter(Boolean) : [],
    live: str(p.live),
    code: str(p.code),
  })),
};

/* ---------- Cleaning / validation (used on every save) ---------- */
type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {};
const text = (v: unknown, max: number, fb: string) =>
  typeof v === "string" ? v.trim().slice(0, max) : fb;
const required = (v: unknown, max: number, fb: string) => text(v, max, fb) || fb;

// Only http(s) links are allowed; anything else is dropped
const cleanUrl = (v: unknown, fb: string) => {
  if (typeof v !== "string") return fb;
  const t = v.trim().slice(0, 300);
  if (!t) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
};

const list = (v: unknown, max: number, maxLen: number, fb: string[]) =>
  Array.isArray(v)
    ? v.map((x) => text(x, maxLen, "")).filter(Boolean).slice(0, max)
    : fb;

export function normalize(raw: unknown): SiteContent {
  const r = obj(raw);
  const p = obj(r.profile);
  const d = DEFAULTS;
  return {
    profile: {
      name: required(p.name, 80, d.profile.name),
      role: required(p.role, 80, d.profile.role),
      location: required(p.location, 80, d.profile.location),
      intro: required(p.intro, 1200, d.profile.intro),
      email: text(p.email, 120, d.profile.email),
      github: cleanUrl(p.github, d.profile.github),
      linkedin: cleanUrl(p.linkedin, d.profile.linkedin),
      whatsapp: text(p.whatsapp, 30, d.profile.whatsapp),
    },
    tagline: required(r.tagline, 160, d.tagline),
    skills: list(r.skills, 24, 40, d.skills),
    services: list(r.services, 12, 80, d.services),
    projects: Array.isArray(r.projects)
      ? r.projects
          .map((x) => {
            const q = obj(x);
            return {
              title: text(q.title, 100, ""),
              summary: text(q.summary, 400, ""),
              stack: list(q.stack, 12, 30, []),
              live: cleanUrl(q.live, ""),
              code: cleanUrl(q.code, ""),
            };
          })
          .filter((q) => q.title)
          .slice(0, 12)
      : d.projects,
  };
}

/* ---------- Database ---------- */
export async function ensureContentTable() {
  await getSql()`
    CREATE TABLE IF NOT EXISTS site_content (
      id integer PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

// Cached for speed; saving in the dashboard clears this tag instantly

export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag("site-content");
  cacheLife("hours");
  try {
    await ensureContentTable(); // first run: creates the table so the read below works
    const rows = await getSql()`SELECT data FROM site_content WHERE id = 1`;
    if (rows.length > 0) return normalize(rows[0].data);
  } catch {
    // database unreachable: fall back to the starter content
  }
  return DEFAULTS;
}

/* ---------- WhatsApp link (Ghana: 054... becomes 23354...) ---------- */
export function whatsappLink(number: string, name: string) {
  let d = number.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = `233${d.slice(1)}`;
  if (d.length < 9) return "";
  const msg = encodeURIComponent(
    `Hi ${name}, I saw your portfolio and I'd like to talk.`
  );
  return `https://wa.me/${d}?text=${msg}`;
}