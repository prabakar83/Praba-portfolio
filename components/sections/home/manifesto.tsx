import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/layout/page-transition";
import { ArrowUpRight } from "lucide-react";

const STATS = [
  { value: "2+", label: "Years in production frontend" },
  { value: "7+", label: "Broadcast & OTT clients supported" },
  { value: "16→18", label: "React version led in production" },
];

/** Studio manifesto — big editorial statement + stats row. */
export function Manifesto() {
  return (
    <section className="border-t border-border">
      <div className="container-x section-y">
        <Reveal>
          <p className="text-label mb-10">02 — How I work</p>
        </Reveal>

        <SplitTextReveal
          as="p"
          type="lines"
          className="text-display-sm max-w-4xl text-foreground/90"
        >
          I came up through QA before frontend, so I think about what breaks
          before I think about what looks good. Every component I ship on a
          shared CMS has to hold up for every client using it, not just mine.
        </SplitTextReveal>

        <Reveal delay={0.2} className="mt-10">
          <TransitionLink
            href="/about"
            data-cursor="hover"
            className="link-underline inline-flex items-center gap-2 text-label text-foreground"
          >
            More about me <ArrowUpRight className="size-3.5" />
          </TransitionLink>
        </Reveal>

        <div className="mt-24 grid gap-10 border-t border-border pt-10 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.12}>
              <p className="font-display text-6xl">{stat.value}</p>
              <p className="text-label mt-3">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
