// All the text on the site lives here. Edit this file and the whole site updates.

export const SITE = {
  name: "Sika Abraham",

  role: "Next.js developer",
  location: "Ghana",
  phoneDisplay: "054 024 5553",
  phoneIntl: "233540245553",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  available: true, // shows the green "available for new projects" badge
  cvUrl: "", // e.g. "/cv.pdf" once your CV is ready (put the file in /public). Shows a Download CV button.
  social: [] as { label: string; href: string }[], // e.g. { label: "GitHub", href: "https://github.com/yourname" }
};

export const waLink = (text: string) => `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(text)}`;
export const telLink = `tel:+${SITE.phoneIntl}`;
export const INITIALS = SITE.name
  .split(" ")
  .map((w) => w[0])
  .join("");

export const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export const TICKER = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Paystack",
  "Mobile Money", "Vercel", "PWA", "Drizzle", "Zod",
];

export const SERVICES = [
  {
    icon: "globe",
    title: "Business websites",
    text: "A fast, good-looking website that works on every phone and gets found on Google.",
    points: ["Mobile-first design", "Search-ready from day one", "WhatsApp and call buttons"],
  },
  {
    icon: "cart",
    title: "Online shops",
    text: "Shops built for how Ghana pays: Mobile Money, cards and WhatsApp orders.",
    points: ["Paystack and MoMo payments", "Stock by size, discounts and sales", "SMS alert for every order"],
  },
  {
    icon: "layers",
    title: "Web apps and dashboards",
    text: "Logins, databases, admin panels and live updates for the way your business runs.",
    points: ["Secure sign-in and roles", "Real-time and offline-ready apps", "Admin screens your team can use"],
  },
  {
    icon: "bolt",
    title: "Fixes and upgrades",
    text: "An existing site that is slow, broken or hard to update? I can improve it.",
    points: ["Speed and SEO tune-ups", "New features and payment links", "Clear fixes, no jargon"],
  },
];

export const PROCESS = [
  { title: "We talk", text: "You tell me what you sell and how your customers pay today, by phone or WhatsApp. No forms." },
  { title: "You see it early", text: "You get a live preview link you can open on your phone, so you never wait in the dark." },
  { title: "Build and refine", text: "I build in steps and adjust based on your feedback until it feels right." },
  { title: "Launch and handover", text: "Your site goes live on your own accounts, and I show you how to run the admin yourself." },
];

export const STACK = [
  { group: "Front end", items: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "Accessibility", "SEO"] },
  { group: "Back end and data", items: ["Server Actions", "PostgreSQL", "Supabase (Auth, Storage, RLS)", "Neon", "Drizzle ORM", "Zod"] },
  { group: "Payments and messaging", items: ["Paystack", "Mobile Money (MoMo)", "SMS alerts", "WhatsApp", "Webhooks"] },
  { group: "Shipping", items: ["Vercel", "Git and GitHub", "PWAs and offline apps", "Performance"] },
];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  tagline: string;
  summary: string;
  role: string;
  accent: "gold" | "green" | "rose";
  liveUrl?: string;
  repoUrl?: string; // paste your GitHub link when you want a "View code" button
  image?: string; // e.g. "/projects/reinitas.png" (a screenshot saved in /public/projects)
  stack: string[];
  challenge: string;
  built: string[];
  technical: { title: string; text: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "reinitas-apparel",
    title: "Reinita’s Apparel",
    kind: "Online shop · Client project",
    year: "2026",
    tagline: "A fashion shop that takes Mobile Money, cards and WhatsApp orders.",
    summary:
      "An online shop for a Ghanaian fashion boutique selling dresses, shoes, sneakers, bags, bundles and bales, with an admin dashboard the owner runs herself.",
    role: "Design, development and launch",
    accent: "rose",
    liveUrl: "https://reinitas-apparel.vercel.app",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Row Level Security", "Paystack", "MoMo", "SMS alerts", "Vercel"],
    challenge:
      "The owner sells fast-moving stock in sizes, is paid by Mobile Money as often as by card, and answers customers on WhatsApp. She needed a shop that would not oversell, would never miss an order, and that she could manage herself without calling a developer.",
    built: [
      "A size-aware catalogue: stock is tracked per size, sold-out sizes are disabled and low stock is flagged.",
      "Two ways to pay: instant online payment through Paystack, or MoMo sent straight to the owner and confirmed in the admin.",
      "A text message to the owner for every order, plus WhatsApp buttons for questions about a product or an order.",
      "An admin dashboard for products, photos, orders, discounts, timed sales with a countdown, policy pages, her logo and MoMo details.",
    ],
    technical: [
      {
        title: "Checkout that cannot oversell",
        text: "One database transaction locks the stock, checks availability, recalculates every price on the server and creates the order, so two customers cannot buy the last size 40 and a changed price cannot slip through.",
      },
      {
        title: "Payments you can trust",
        text: "Paystack webhooks are signature-verified and safe to repeat, the redirect is double-checked with Paystack, and a late payment on an expired order is revived or flagged to the owner by SMS.",
      },
      {
        title: "Discounts and sales in one rule",
        text: "Product discounts and scheduled sales are resolved by a single database function used by both the shop and checkout, so the price on screen always matches the price charged.",
      },
      {
        title: "Locked-down data",
        text: "Row Level Security keeps customer orders private, only server code can create orders, and the admin is checked on every page and action.",
      },
      {
        title: "Built to be found",
        text: "Structured data for Google, a sitemap, branded share images, and fast server-rendered pages.",
      },
    ],
  },
  {
    slug: "realtime-kanban",
    title: "Real-time Kanban board",
    kind: "Web app · Portfolio project",
    year: "2026",
    tagline: "A shared board where cards move live for everyone.",
    summary:
      "Teams create boards, add cards and drag them between columns, and every collaborator sees the changes appear within a second.",
    role: "Design and full-stack development",
    accent: "green",
    stack: ["Next.js", "TypeScript", "Neon Postgres", "Drizzle ORM", "Auth.js", "Pusher", "dnd-kit", "Zod", "Vercel"],
    challenge:
      "Collaborative tools feel broken when they lag. The goal was a board that reacts instantly to your own moves, stays in sync with everyone else’s, and cannot be abused by someone calling the server directly.",
    built: [
      "Google sign-in and shared boards that people join with a link.",
      "Drag and drop that works with a mouse and with touch.",
      "Live updates: when one person moves a card, everyone else’s board updates on its own.",
    ],
    technical: [
      {
        title: "Instant, even on slow networks",
        text: "Moves are applied immediately with React’s optimistic updates, then confirmed by the server, and rolled back if it fails.",
      },
      {
        title: "Ordering without renumbering",
        text: "Cards use fractional positions, so moving one card updates one row instead of renumbering the whole column.",
      },
      {
        title: "Realtime that stays secure",
        text: "The realtime channel only sends a “something changed” ping. Clients refetch through authorised server code, so no private data travels over it.",
      },
      {
        title: "Server Actions treated as public endpoints",
        text: "Every action validates its input with Zod, checks board membership, and verifies that a column really belongs to the board.",
      },
    ],
  },
  {
    slug: "offline-notes-pwa",
    title: "Offline-first notes app",
    kind: "PWA · Portfolio project",
    year: "2026",
    tagline: "Write with no internet. Everything syncs when you are back online.",
    summary:
      "An installable notes app that keeps working with no connection and syncs to the cloud in the background whenever the phone is online.",
    role: "Design and full-stack development",
    accent: "gold",
    stack: ["Next.js", "TypeScript", "Dexie (IndexedDB)", "Service Worker", "Neon Postgres", "Drizzle ORM", "Auth.js", "Zod"],
    challenge:
      "Connections in the real world drop all the time. The app had to feel instant, never lose what you typed, and still end up consistent across devices.",
    built: [
      "Notes are saved on the device first, so the app never waits for the network.",
      "A visible sync status, with unsynced notes marked until they are safely stored.",
      "An installable app that opens and works with no internet after the first visit.",
    ],
    technical: [
      {
        title: "Local-first by design",
        text: "The interface reads and writes the device’s own database, and syncing is a separate background job.",
      },
      {
        title: "Reliable sync",
        text: "Edits are queued as an outbox and sent in batches. The server uses an ever-increasing sequence number as the pull cursor instead of trusting device clocks.",
      },
      {
        title: "Conflicts and deletes",
        text: "Last-write-wins by timestamp (with far-future clocks clamped), and soft deletes so removals sync across devices.",
      },
      {
        title: "Works offline for real",
        text: "A hand-written service worker caches the app shell with different strategies for pages, build files and API calls, and each user gets a separate local database.",
      },
    ],
  },
];
