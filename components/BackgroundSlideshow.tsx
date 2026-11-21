"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { BgSlot } from "@/lib/backgrounds";

const HIDDEN_ON = ["/admin", "/signin"];

export default function BackgroundSlideshow({ slots }: { slots: BgSlot[] }) {
  const pathname = usePathname();
  const [active, setActive] = useState(0);
  const [reach, setReach] = useState(1); // photos requested so far: load the next one early, never all at once
  const count = slots.length;
  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (hidden || count === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      const next = Math.min(count - 1, Math.floor(progress * count));
      setActive(next);
      setReach((r) => Math.max(r, next + 2));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hidden, count, pathname]);

  if (hidden || count === 0) return null;

  return (
    <div className="bgfx" aria-hidden="true">
      {slots.map(
        (s, i) =>
          i < reach && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.slot}
              src={`/api/background/${s.slot}?v=${s.v}`}
              alt=""
              className="bgfx__img"
              data-on={i === active}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "low"}
            />
          )
      )}
      <div className="bgfx__shade" />
    </div>
  );
}