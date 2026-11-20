import { neon } from "@neondatabase/serverless";

export function getSql() {
  return neon(process.env.DATABASE_URL!);
}

export async function ensureAvatarTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS site_avatar (
      id integer PRIMARY KEY,
      mime text NOT NULL,
      data text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}