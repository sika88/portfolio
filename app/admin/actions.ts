"use server";

import { updateTag } from "next/cache";
import { auth, isAdminSession } from "@/auth";
import { getSql } from "@/lib/avatar-db";
import {
  DEFAULTS,
  ensureContentTable,
  normalize,
  type SiteContent,
} from "@/lib/content";

type Result = { ok: boolean; error?: string; content?: SiteContent };

export async function saveContent(input: unknown): Promise<Result> {
  if (!isAdminSession(await auth())) return { ok: false, error: "Not authorised." };
  try {
    const data = normalize(input);
    await ensureContentTable();
    await getSql()`
      INSERT INTO site_content (id, data)
      VALUES (1, ${JSON.stringify(data)}::jsonb)
      ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = now()
    `;
    updateTag("site-content");
    return { ok: true, content: data };
  } catch {
    return { ok: false, error: "Could not save. Check DATABASE_URL." };
  }
}

export async function resetContent(): Promise<Result> {
  if (!isAdminSession(await auth())) return { ok: false, error: "Not authorised." };
  try {
    await ensureContentTable();
    await getSql()`DELETE FROM site_content WHERE id = 1`;
    updateTag("site-content");
    return { ok: true, content: DEFAULTS };
  } catch {
    return { ok: false, error: "Could not reset." };
  }
}