"use client";

import { useRef, useState } from "react";
import type { BgSlot } from "@/lib/backgrounds";

const SLOTS = [1, 2, 3, 4];
const MAX_SIDE = 1800;
const TARGET_BYTES = 450 * 1024;

// Shrink and compress in the browser so uploads stay small and fast
function toBackgroundBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      URL.revokeObjectURL(url);
      let scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      for (let attempt = 0; attempt < 5; attempt++) {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>((r) =>
          canvas.toBlob(r, "image/jpeg", 0.78)
        );
        if (blob && blob.size <= TARGET_BYTES) return resolve(blob);
        scale *= 0.8;
      }
      reject(new Error("Image is too large"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

type Msg = { kind: "ok" | "error"; text: string } | null;

export default function BackgroundManager({ initial }: { initial: BgSlot[] }) {
  const [versions, setVersions] = useState<Record<number, number | null>>(() =>
    Object.fromEntries(SLOTS.map((s) => [s, initial.find((b) => b.slot === s)?.v ?? null]))
  );
  const [busy, setBusy] = useState<number | null>(null);
  const [msg, setMsg] = useState<Msg>(null);
  const inputs = useRef<Record<number, HTMLInputElement | null>>({});

  async function upload(slot: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(slot);
    setMsg(null);
    try {
      const blob = await toBackgroundBlob(file);
      const form = new FormData();
      form.append("file", blob, `background-${slot}.jpg`);
      const res = await fetch(`/api/background/${slot}`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      setVersions((v) => ({ ...v, [slot]: Date.now() }));
      setMsg({ kind: "ok", text: `Photo ${slot} saved.` });
    } catch {
      setMsg({ kind: "error", text: "Upload failed. Try another photo, or sign in again." });
    } finally {
      setBusy(null);
    }
  }

  async function remove(slot: number) {
    if (!confirm(`Remove photo ${slot}?`)) return;
    setBusy(slot);
    setMsg(null);
    try {
      const res = await fetch(`/api/background/${slot}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setVersions((v) => ({ ...v, [slot]: null }));
      setMsg({ kind: "ok", text: `Photo ${slot} removed.` });
    } catch {
      setMsg({ kind: "error", text: "Could not remove the photo." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="adm-card">
      <h2>Background photos</h2>
      <p className="adm-hint">
        Up to four photos fade in one after another as visitors scroll. Photo 1 shows at the top
        of the page. Photos save the moment you pick them, so there is no need to press Save
        changes. Portrait or landscape both work; keep faces in the upper part of the photo.
      </p>

      <div className="adm-bg">
        {SLOTS.map((slot) => {
          const v = versions[slot];
          return (
            <div className="adm-bg__slot" key={slot}>
              <div className={`adm-bg__thumb${v ? " adm-bg__thumb--filled" : ""}`}>
                {v ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/background/${slot}?v=${v}`} alt={`Background photo ${slot}`} />
                ) : (
                  <span>Empty</span>
                )}
              </div>
              <strong className="adm-bg__label">Photo {slot}</strong>
              <div className="adm-bg__actions">
                <button
                  className="adm-btn"
                  disabled={busy !== null}
                  onClick={() => inputs.current[slot]?.click()}
                >
                  {busy === slot ? "Saving…" : v ? "Replace" : "Upload"}
                </button>
                {v && (
                  <button
                    className="adm-btn adm-btn--danger"
                    disabled={busy !== null}
                    onClick={() => remove(slot)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={(el) => {
                  inputs.current[slot] = el;
                }}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => upload(slot, e)}
              />
            </div>
          );
        })}
      </div>

      {msg && (
        <p className={`adm-status adm-status--${msg.kind}`} role="status" style={{ marginTop: "1rem" }}>
          {msg.text}
        </p>
      )}
    </section>
  );
}