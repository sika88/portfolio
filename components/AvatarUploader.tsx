"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

const SOURCES = ["/api/avatar", "/profile.jpg"]; // then initials

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

export default function AvatarUploader({ name }: { name: string }) {
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
    if (img && img.complete && img.naturalWidth === 0) {
      setStage((s) => s + 1);
    }
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

  async function logout() {
    await signOut({ redirect: false });
    setAdmin(false);
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const src =
    stage === 0 ? `/api/avatar?v=${version}` : stage === 1 ? SOURCES[1] : null;

  return (
    <>
      <div
        className={`avatar${admin ? " avatar--admin" : ""}`}
        onContextMenu={(e) => {
          if (!admin) return; // visitors get the normal browser menu
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY });
        }}
        title={admin ? "Right-click to change photo" : undefined}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            ref={imgRef}
            src={src}
            alt={`Photo of ${name}`}
            className="avatar__img"
            onError={() => setStage((s) => s + 1)}
          />
        ) : (
          <span className="avatar__placeholder" aria-label={`${name} placeholder`}>
            {initials}
          </span>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />

      {admin && menu && (
        <ul className="avatar-menu" role="menu" style={{ top: menu.y, left: menu.x }}>
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
          <li role="none">
            <button role="menuitem" onClick={logout}>
              Sign out
            </button>
          </li>
          <li role="none">
            <button role="menuitem" onClick={() => (window.location.href = "/admin")}>
                Admin dashboard
            </button>
</li>
        </ul>
      )}
    </>
  );
}