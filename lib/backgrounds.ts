import { cacheLife, cacheTag } from "next/cache";
import { getSql } from "@/lib/avatar-db";

export const BG_SLOTS = 4;

export type BgSlot = { slot: number; v: number };

export async function ensureBackgroundTable() {
  await getSql()`
    CREATE TABLE IF NOT EXISTS site_backgrounds (
      slot integer PRIMARY KEY,
      mime text NOT NULL,
      data text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

// Which slots have a photo, plus a version number used to bust browser caches.
// Cached for speed; the upload route clears the "backgrounds" tag.
export async function getBackgrounds(): Promise<BgSlot[]> {
  "use cache";
  cacheTag("backgrounds");
  cacheLife("hours");
  try {
    await ensureBackgroundTable();
    const rows = await getSql()`
      SELECT slot, extract(epoch from updated_at)::bigint AS v
      FROM site_backgrounds ORDER BY slot
    `;
    return rows.map((r) => ({ slot: Number(r.slot), v: Number(r.v) }));
  } catch {
    return [];
  }
}