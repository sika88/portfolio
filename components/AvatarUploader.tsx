"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "profile-avatar";
const DEFAULT_SRC = "/profile.jpg";

// Crop to a centered square and shrink, so the saved image stays small
function toSquareDataUrl(file: File, size = 256): Promise<string> {
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
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export default function AvatarUploader({ name }: { name: string }) {
  const [src, setSrc] = useState<string | null>(DEFAULT_SRC);
  const [custom, setCustom] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load a previously uploaded image
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSrc(saved);
        setCustom(true);
      }
    } catch {}
  }, []);

  // Close the menu on any click, scroll, or Escape
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
      const dataUrl = await toSquareDataUrl(file);
      setSrc(dataUrl);
      setCustom(true);
      localStorage.setItem(STORAGE_KEY, dataUrl);
    } catch {
      alert("Sorry, that image could not be used.");
    }
  }

  function removePhoto() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSrc(DEFAULT_SRC);
    setCustom(false);
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <div
        className="avatar"
        onContextMenu={(e) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY });
        }}
        title="Right-click to change photo"
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`Photo of ${name}`}
            className="avatar__img"
            onError={() => setSrc(null)}
          />
        ) : (
          <span className="avatar__placeholder" aria-label={`${name} placeholder`}>
            {initials}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onFile}
      />

      {menu && (
        <ul
          className="avatar-menu"
          role="menu"
          style={{ top: menu.y, left: menu.x }}
        >
          <li role="none">
            <button role="menuitem" onClick={() => inputRef.current?.click()}>
              Upload image…
            </button>
          </li>
          {custom && (
            <li role="none">
              <button role="menuitem" onClick={removePhoto}>
                Remove photo
              </button>
            </li>
          )}
        </ul>
      )}
    </>
  );
}