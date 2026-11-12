import { auth, isAdminSession } from "@/auth";
import { ensureAvatarTable, getSql } from "@/lib/avatar-db";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 500 * 1024;

// Public: anyone can view the picture
export async function GET() {
  try {
    const rows = await getSql()`SELECT mime, data FROM site_avatar WHERE id = 1`;
    if (rows.length === 0) return new Response(null, { status: 404 });
    const bytes = new Uint8Array(Buffer.from(rows[0].data as string, "base64"));
    return new Response(bytes, {
      headers: {
        "Content-Type": rows[0].mime as string,
        "Cache-Control": "public, max-age=60",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}

// Admin only: upload or replace
export async function POST(req: Request) {
  if (!isAdminSession(await auth())) {
    return new Response("Forbidden", { status: 403 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !ALLOWED.includes(file.type)) {
    return Response.json({ error: "Invalid image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image too large" }, { status: 413 });
  }
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");
  await ensureAvatarTable();
  await getSql()`
    INSERT INTO site_avatar (id, mime, data)
    VALUES (1, ${file.type}, ${data})
    ON CONFLICT (id) DO UPDATE
    SET mime = EXCLUDED.mime, data = EXCLUDED.data, updated_at = now()
  `;
  return Response.json({ ok: true });
}

// Admin only: remove
export async function DELETE() {
  if (!isAdminSession(await auth())) {
    return new Response("Forbidden", { status: 403 });
  }
  try {
    await getSql()`DELETE FROM site_avatar WHERE id = 1`;
  } catch {}
  return Response.json({ ok: true });
}