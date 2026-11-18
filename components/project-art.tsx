import Image from "next/image";
import type { Project } from "@/lib/content";

const TONES = {
  gold: "from-[#f2c14e]/30 via-[#f2c14e]/8 to-transparent text-[#f2c14e]",
  green: "from-[#2bb673]/30 via-[#2bb673]/8 to-transparent text-[#2bb673]",
  rose: "from-[#e5566d]/30 via-[#e5566d]/8 to-transparent text-[#e5566d]",
};

// A screenshot if you added one, otherwise a clean generated cover
export default function ProjectArt({ project, className = "" }: { project: Project; className?: string }) {
  if (project.image) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface-2 ${className}`}>
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    );
  }

  const initials = project.title
    .replace(/[^\p{L}\s]/gu, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface-2 bg-linear-to-br ${TONES[project.accent]} ${className}`}>
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-70" />
      <div className="relative flex h-full min-h-48 flex-col justify-between p-6">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <p aria-hidden="true" className="font-display text-6xl font-semibold tracking-tight">
          {initials}
        </p>
      </div>
    </div>
  );
}
