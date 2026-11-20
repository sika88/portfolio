// Edit this file. Everything on the page comes from here.
export const profile = {
  name: "Sika Abraham",
  role: "Next.js developer",
  location: "Accra, Ghana",
  intro:
    "I build full-stack web apps with Next.js: sign-in, databases, real-time updates, and offline support. Open to remote roles and projects for businesses in Ghana.",
  email: "prestycosmos@gmail.com",
  github: "https://github.com/sika88",
  linkedin: "https://www.linkedin.com/in/abraham-sika-a3191115a/",
};

export const projects = [
  {
    title: "Real-time Kanban board",
    summary:
      "Teams sign in with Google, create boards, and see cards move live across every open screen.",
    stack: ["Next.js", "Auth.js", "Drizzle", "Neon Postgres", "Pusher"],
    live: "https://kanban-delta-beige.vercel.app/",
    code: "https://github.com/sika88/kanban",
  },
  {
    title: "Offline-first PWA",
    summary:
      "An installable app that keeps working without internet and syncs your changes when you reconnect.",
    stack: ["Next.js", "Service workers", "IndexedDB", "Neon Postgres"],
    live: "",
    code: "",
  },
];

export const skills = [
  { group: "Frontend", items: "Next.js (App Router), React, TypeScript, CSS" },
  { group: "Backend and data", items: "Auth.js, Drizzle ORM, PostgreSQL (Neon), server actions" },
  { group: "Shipping", items: "Vercel, Git and GitHub, Pusher, PWAs" },
];

export const services = [
  "Business websites with Mobile Money and card payments",
  "Web apps with sign-in and a database",
  "Speed and SEO fixes for existing sites",
  "Desktop APPS and any software systems"
];