import { Marquee } from "@/components/motion/marquee";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { Reveal } from "@/components/motion/reveal";

const AWARDS = [
  "React & React Hooks",
  "TypeScript",
  "GraphQL & REST",
  "Micro Frontend Architecture",
  "Redux / Context API",
  "Agile / Scrum, Jira",
];

/** Social proof: award marquee + one big testimonial. */
export function Testimonial() {
  return (
    <section className="border-t border-border">
      <div className="py-10" aria-label="Awards">
        <Marquee duration={28} reverse>
          {AWARDS.map((award) => (
            <span
              key={award}
              className="flex items-center gap-[4vw] whitespace-nowrap text-label !text-base"
            >
              {award}
              <span className="text-accent" aria-hidden="true">
                —
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x section-y border-t border-border">
        <Reveal>
          <p className="text-label mb-10">04 — How I think about it</p>
        </Reveal>
        <figure>
          <blockquote>
            <SplitTextReveal
              as="p"
              type="lines"
              className="text-display-sm max-w-5xl italic text-foreground/90"
            >
              “I came to frontend through QA, so I still think about what
              breaks before I think about what looks good.”
            </SplitTextReveal>
          </blockquote>
          <Reveal delay={0.25}>
            <figcaption className="mt-10 text-sm text-muted-foreground">
              <span className="text-foreground">Prabakar M</span> — Software
              Developer, Primesoft Solutions / Quickplay Media
            </figcaption>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}
