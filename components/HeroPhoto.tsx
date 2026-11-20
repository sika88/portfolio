"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroPhoto({ name }: { name: string }) {
  const [stage, setStage] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Catch images that failed before React hydrated
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setStage((s) => s + 1);
    }
  }, [stage]);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const src = stage === 0 ? "/api/avatar" : stage === 1 ? "/profile.jpg" : null;

  return (
    <div className="pf-photo">
      <div className="pf-photo__glow" aria-hidden="true" />
      <div className="pf-photo__frame">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            ref={imgRef}
            src={src}
            alt={`Photo of ${name}`}
            onError={() => setStage((s) => s + 1)}
          />
        ) : (
          <span className="pf-photo__initials">{initials}</span>
        )}
      </div>
    </div>
  );
}