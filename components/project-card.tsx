import Link from "next/link";
import Icon from "@/components/icons";
import ProjectArt from "@/components/project-art";
import type { Project } from "@/lib/content";

export default function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group block rounded-3xl border border-border bg-surface p-4 transition hover:border-accent/60 sm:p-5 ${
        featured ? "lg:grid lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-10 lg:p-6" : ""
      }`}
    >
      <ProjectArt project={project} className={`${featured ? "aspect-[16/10]" : "aspect-[16/10]"} transition duration-500 group-hover:scale-[1.01]`} />

      <div className={featured ? "mt-5 lg:mt-0" : "mt-5"}>
        <p className="eyebrow">{project.kind}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h3>
        <p className="mt-3 text-muted">{project.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, featured ? 6 : 4).map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
        <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          View case study
          <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}
