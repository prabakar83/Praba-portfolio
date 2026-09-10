import type { Metadata } from "next";
import Image from "next/image";
import portrait from "./prabakar.png";
import { siteConfig } from "@/content/site.config";
import { Reveal } from "@/components/motion/reveal";
import { SplitTextReveal } from "@/components/motion/split-text-reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { Marquee } from "@/components/motion/marquee";
import { padIndex } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "React developer with a QA background, building CMS platforms for OTT and broadcast media.",
};

const VALUES = [
  {
    name: "Quality isn't a separate step",
    description:
      "I came to frontend through QA — I still think about what breaks before I think about what looks good.",
  },
  {
    name: "Shared platforms need discipline",
    description:
      "The CMS I work on serves 7+ broadcast and OTT clients at once. Micro Frontend architecture keeps teams shipping without stepping on each other.",
  },
  {
    name: "Modernize without disrupting",
    description:
      "Led a React 16→18 and Node 16→20 upgrade on a live, multi-client platform, without pausing delivery.",
  },
  {
    name: "Still building outward",
    description:
      "Python, FastAPI and SQL sit alongside frontend work — I build the interface and the APIs that support it, so the whole product feels consistent and dependable.",
  },
];

const TEAM = [{ name: "Prabakar M", role: "Software Developer, Primesoft Solutions / Quickplay Media" }];

const STACK = [
  {
    group: "Frontend",
    items: ["React", "React Hooks", "TypeScript", "Redux / Context API", "React Router", "Micro Frontend (Module Federation)", "JSONForms"],
  },
  {
    group: "API & tooling",
    items: ["GraphQL", "REST APIs", "Git", "Webpack / Vite", "Jest / RTL"],
  },
  {
    group: "Backend & data",
    items: ["Python", "FastAPI", "SQL", "Redis", "NumPy / Pandas", "Matplotlib"],
  },
  {
    group: "Methods & analysis",
    items: ["Agile / Scrum", "Jira", "Tableau", "Power BI"],
  },
];

export default function AboutPage() {
  return (
    <main className="pt-40">
      <header className="container-x mb-24">
        <Reveal>
          <p className="text-label mb-8">About</p>
        </Reveal>
        <SplitTextReveal
          as="h1"
          type="words"
          className="text-display-xl max-w-[14ch]"
        >
          From catching bugs to building the systems
        </SplitTextReveal>
        <Reveal delay={0.25}>
          <p className="mt-10 max-w-xl text-lg text-muted-foreground">
            I&apos;m a developer from Chennai, India, with a strong focus on
            frontend engineering and a practical understanding of Python and
            FastAPI for backend work. I enjoy building interfaces that teams use
            every day, and I care just as much about the systems behind them —
            the APIs, data flow, and reliability that make the product work at
            scale.
          </p>
        </Reveal>
      </header>

      {/* Image band */}
      <div className="relative h-[min(70vh,48rem)] overflow-hidden bg-surface" style={{ backgroundColor: "black" }}>
        <ParallaxLayer speed={-0.2} className="absolute inset-0">
          <Image
            src={portrait} 
            alt="Portrait of Prabakar M"
            fill
            sizes="100vw"
            className="object-contain object-center"
          />
        </ParallaxLayer>
      </div>

      {/* Values */}
      <section className="container-x section-y">
        <Reveal>
          <p className="text-label mb-14">How I work</p>
        </Reveal>
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {VALUES.map((value, i) => (
            <Reveal key={value.name} delay={(i % 2) * 0.12}>
              <div className="border-t border-border pt-6">
                <p className="text-label mb-4">{padIndex(i)}</p>
                <h2 className="font-display text-3xl">{value.name}</h2>
                <p className="mt-4 max-w-md text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border">
        <div className="container-x section-y">
          <Reveal>
            <p className="text-label mb-14">Who&apos;s behind it</p>
          </Reveal>
          <ul>
            {TEAM.map((person, i) => (
              <Reveal key={person.name} delay={i * 0.08}>
                <li className="group flex flex-wrap items-baseline justify-between gap-2 border-t border-border py-6 last:border-b">
                  <span className="font-display text-3xl transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent">
                    {person.name}
                  </span>
                  <span className="text-label">{person.role}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Stack */}
      <section className="border-t border-border">
        <div className="container-x section-y">
          <Reveal>
            <p className="text-label mb-14">What I work with</p>
          </Reveal>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STACK.map((group, i) => (
              <Reveal key={group.group} delay={i * 0.08}>
                <h3 className="text-label mb-5 text-foreground">
                  {group.group}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Rolling statement */}
      <div className="border-t border-border py-12" aria-hidden="true">
        <Marquee duration={24}>
          <span className="flex items-center gap-[4vw] whitespace-nowrap font-display text-5xl italic text-muted-foreground/50">
            Ship with intent — test before it breaks —
          </span>
        </Marquee>
      </div>
    </main>
  );
}
