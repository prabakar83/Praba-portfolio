import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  caseStudies,
  getCaseStudy,
  getAdjacentCaseStudies,
} from "@/content/case-studies";
import { Reveal } from "@/components/motion/reveal";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { TransitionLink } from "@/components/layout/page-transition";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case study`,
    description: project.tagline,
    openGraph: { images: [project.cover] },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentCaseStudies(slug);

  return (
    <main className="pt-40">
      {/* Header */}
      <header className="container-x mb-16">
        <Reveal>
          <div className="mb-8 flex flex-wrap gap-2">
            {project.categories.map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
          </div>
        </Reveal>
        <SplitTextReveal as="h1" type="words" className="text-display-xl">
          {project.title}
        </SplitTextReveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl font-display text-2xl italic text-muted-foreground">
            {project.tagline}
          </p>
        </Reveal>
      </header>

      {/* Hero image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-surface md:aspect-[21/9]">
        <ParallaxLayer speed={-0.35} className="absolute -inset-y-16 inset-x-0">
          <Image
            src={project.cover}
            alt={`${project.title} — hero artwork`}
            fill
            priority
            sizes="100vw"
            className={cn(
              project.coverFit === "contain" ? "object-contain" : "object-cover",
              "transition-transform duration-700 ease-out",
            )}
          />
        </ParallaxLayer>
      </div>

      {/* Meta row */}
      <div className="container-x">
        <div className="grid gap-8 border-b border-border py-12 sm:grid-cols-3">
          <Reveal>
            <p className="text-label mb-3">Client</p>
            <div className="flex flex-wrap gap-2">
              {project.client.split(" / ").map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-border px-3 py-1 text-sm text-foreground"
                >
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-label mb-2">Year</p>
            <p>{project.year}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-label mb-2">Services</p>
            <p>{project.services.join(", ")}</p>
          </Reveal>
        </div>
        {project.website && (
          <Reveal delay={0.25}>
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="link-underline mt-8 inline-flex items-center gap-2 text-sm text-foreground"
            >
              Visit the live site <ArrowRight className="size-3.5" />
            </a>
          </Reveal>
        )}
      </div>

      {/* Editorial body */}
      <article className="container-x section-y">
        <div className="mx-auto max-w-3xl space-y-20">
          <SplitTextReveal
            as="p"
            type="lines"
            className="text-display-sm text-foreground/90"
          >
            {project.intro}
          </SplitTextReveal>

          <Reveal>
            <h2 className="text-label mb-6">The challenge</h2>
            <p className="text-lg leading-relaxed text-foreground/80">
              {project.challenge}
            </p>
          </Reveal>

          <Reveal>
            <h2 className="text-label mb-6">The approach</h2>
            <p className="text-lg leading-relaxed text-foreground/80">
              {project.approach}
            </p>
          </Reveal>
        </div>

        {/* Gallery */}
        <div className="mt-28 grid gap-10 md:grid-cols-2">
          {project.gallery.map((src, i) => (
            <Reveal key={src} delay={i * 0.15}>
              <div className="relative aspect-[4/3] overflow-hidden rounded bg-surface">
                <Image
                  src={src}
                  alt={`${project.title} — detail ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={
                    project.coverFit === "contain"
                      ? "object-contain"
                      : "object-cover"
                  }
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Results */}
        <div className="mt-28 grid gap-10 border-t border-border pt-12 sm:grid-cols-3">
          {project.results.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.12}>
              <p className="font-display text-5xl text-accent">{r.value}</p>
              <p className="text-label mt-3">{r.label}</p>
            </Reveal>
          ))}
        </div>
      </article>

      {/* Prev / next navigation */}
      <nav
        aria-label="More case studies"
        className="grid border-t border-border sm:grid-cols-2"
      >
        <TransitionLink
          href={`/work/${prev.slug}`}
          data-cursor="view"
          data-cursor-label="Prev"
          className="group border-b border-border p-10 transition-colors hover:bg-surface sm:border-b-0 sm:border-r"
        >
          <p className="text-label mb-4 flex items-center gap-2">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            Previous
          </p>
          <p className="font-display text-3xl group-hover:text-accent">
            {prev.title}
          </p>
        </TransitionLink>
        <TransitionLink
          href={`/work/${next.slug}`}
          data-cursor="view"
          data-cursor-label="Next"
          className="group p-10 text-right transition-colors hover:bg-surface"
        >
          <p className="text-label mb-4 flex items-center justify-end gap-2">
            Next
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </p>
          <p className="font-display text-3xl group-hover:text-accent">
            {next.title}
          </p>
        </TransitionLink>
      </nav>
    </main>
  );
}
