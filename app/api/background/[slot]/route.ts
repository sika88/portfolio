import { revalidateTag } from "next/cache";
import { auth, isAdminSession } from "@/auth";
import { getSql } from "@/lib/avatar-db";
import { BG_SLOTS, ensureBackgroundTable } from "@/lib/backgrounds";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 600 * 1024;

type Ctx = { params: Promise<{ slot: string }> };

async function parseSlot(ctx: Ctx) {
  const n = Number((await ctx.params).slot);
  return Number.isInteger(n) && n >= 1 && n <= BG_SLOTS ? n : null;
}

// Public: anyone can view the photos
export async function GET(_req: Request, ctx: Ctx) {
  const slot = await parseSlot(ctx);
  if (!slot) return new Response(null, { status: 404 });
  try {
    const rows = await getSql()`SELECT mime, data FROM site_backgrounds WHERE slot = ${slot}`;
    if (rows.length === 0) return new Response(null, { status: 404 });
    const bytes = new Uint8Array(Buffer.from(rows[0].data as string, "base64"));
    return new Response(bytes, {
      headers: {
        "Content-Type": rows[0].mime as string,
        // URLs carry ?v=<version>, so a new upload always gets a new URL
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}

// Admin only: upload or replace
export async function POST(req: Request, ctx: Ctx) {
  if (!isAdminSession(await auth())) return new Response("Forbidden", { status: 403 });
  const slot = await parseSlot(ctx);
  if (!slot) return new Response("Not found", { status: 404 });

  const file = (await req.formData()).get("file");
  if (!(file instanceof File) || !ALLOWED.includes(file.type)) {
    return Response.json({ error: "Invalid image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image too large" }, { status: 413 });
  }
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");
  await ensureBackgroundTable();
  await getSql()`
    INSERT INTO site_backgrounds (slot, mime, data)
    VALUES (${slot}, ${file.type}, ${data})
    ON CONFLICT (slot) DO UPDATE
    SET mime = EXCLUDED.mime, data = EXCLUDED.data, updated_at = now()
  `;
  revalidateTag("backgrounds", { expire: 0 });
  return Response.json({ ok: true });
}

// Admin only: remove
export async function DELETE(_req: Request, ctx: Ctx) {
  if (!isAdminSession(await auth())) return new Response("Forbidden", { status: 403 });
  const slot = await parseSlot(ctx);
  if (!slot) return new Response("Not found", { status: 404 });
  try {
    await getSql()`DELETE FROM site_backgrounds WHERE slot = ${slot}`;
  } catch {}
  revalidateTag("backgrounds", { expire: 0 });
  return Response.json({ ok: true });
}