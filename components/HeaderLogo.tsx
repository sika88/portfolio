"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const FALLBACK = "/profile.jpg"; // then the initials

// Crop to a centered square and shrink before uploading
function toSquareBlob(file: File, size = 640): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Could not encode"))),
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export default function HeaderLogo({ name, initials }: { name: string; initials: string }) {
  const [admin, setAdmin] = useState(false);
  const [stage, setStage] = useState(0);
  const [version, setVersion] = useState(0);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Ask the server whether this visitor is the admin
  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAdmin(!!d.admin))
      .catch(() => setAdmin(false));
  }, []);

  // Catch images that failed before React hydrated
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setStage((s) => s + 1);
  }, [stage]);

  // Close the menu on click, scroll, or Escape
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const blob = await toSquareBlob(file);
      const form = new FormData();
      form.append("file", blob, "avatar.jpg");
      const res = await fetch("/api/avatar", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      setStage(0);
      setVersion(Date.now());
    } catch {
      alert("Sorry, the upload failed. Make sure you are signed in.");
    }
  }

  async function removePhoto() {
    await fetch("/api/avatar", { method: "DELETE" });
    setStage(0);
    setVersion(Date.now());
  }

  const src =
    stage === 0
      ? version
        ? `/api/avatar?v=${version}`
        : "/api/avatar"
      : stage === 1
        ? FALLBACK
        : null;

  return (
    <>
      <Link href="/" className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-accent font-display text-sm font-bold text-background"
          title={admin ? "Right-click to change photo" : undefined}
          onContextMenu={(e) => {
            if (!admin) return; // visitors get the normal browser menu
            e.preventDefault();
            setMenu({ x: e.clientX, y: e.clientY });
          }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              ref={imgRef}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setStage((s) => s + 1)}
            />
          ) : (
            initials
          )}
        </span>
        <span className="font-display text-base font-semibold tracking-tight">{name}</span>
      </Link>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />

      {admin &&
        menu &&
        createPortal(
          <ul
            className="avatar-menu"
            role="menu"
            style={{ position: "fixed", top: menu.y, left: menu.x, zIndex: 60 }}
          >
            <li role="none">
              <button role="menuitem" onClick={() => inputRef.current?.click()}>
                Upload image…
              </button>
            </li>
            <li role="none">
              <button role="menuitem" onClick={removePhoto}>
                Remove photo
              </button>
            </li>
          </ul>,
          document.body
        )}
    </>
  );
}