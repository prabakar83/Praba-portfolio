import Image from "next/image";
import type { CaseStudy } from "@/content/case-studies";
import { TransitionLink } from "@/components/layout/page-transition";
import { padIndex } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: CaseStudy;
  index: number;
  className?: string;
  priority?: boolean;
}

/** Case-study card with hover zoom + custom "View" cursor. */
export function ProjectCard({
  project,
  index,
  className,
  priority = false,
}: ProjectCardProps) {
  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      data-cursor="view"
      data-cursor-label="View"
      className={cn("group block", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded bg-surface">
        <Image
          src={project.cover}
          alt={`${project.title} — ${project.tagline}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            project.coverFit === "contain" ? "object-contain" : "object-cover",
            "transition-transform duration-700 ease-out group-hover:scale-105",
          )}
        />
        <div className="absolute inset-0 bg-background/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="text-label">{padIndex(index)}</span>
          <h3 className="font-display text-2xl transition-colors duration-300 group-hover:text-accent">
            {project.title}
          </h3>
        </div>
        <span className="text-label shrink-0">{project.year}</span>
      </div>
      <p className="mt-1 pl-10 text-sm text-muted-foreground">
        {project.categories.join(" · ")}
      </p>
    </TransitionLink>
  );
}
