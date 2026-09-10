"use client";

import { Reveal } from "@/components/motion/reveal";
import { padIndex } from "@/lib/utils";

const SERVICES = [
  {
    name: "Frontend Engineering",
    description:
      "React, TypeScript, Redux/Context, React Router — production UI for CMS platforms.",
  },
  {
    name: "Python & FastAPI",
    description:
      "API development, service logic and backend integrations using Python and FastAPI for production systems.",
  },
  {
    name: "Micro Frontend Architecture",
    description:
      "Module Federation setups that let teams ship independently without deployment conflicts.",
  },
  {
    name: "API Integration",
    description:
      "GraphQL and REST integration for dynamic content, metadata and scheduling.",
  },
  {
    name: "Legacy Modernization",
    description:
      "Led a React 16→18 and Node 16→20 upgrade on a live, multi-client platform.",
  },
];

/** Services — editorial index rows with hover accent. */
export function Services() {
  return (
    <section className="border-t border-border">
      <div className="container-x section-y">
        <Reveal>
          <p className="text-label mb-14">03 — What we do</p>
        </Reveal>
        <ul>
          {SERVICES.map((service, i) => (
            <Reveal key={service.name} delay={i * 0.08}>
              <li className="group flex flex-wrap items-baseline gap-x-10 gap-y-2 border-t border-border py-8 transition-colors last:border-b hover:bg-surface/60">
                <span className="text-label w-10">{padIndex(i)}</span>
                <h3 className="font-display text-3xl transition-all duration-300 group-hover:translate-x-2 group-hover:italic group-hover:text-accent md:text-4xl">
                  {service.name}
                </h3>
                <p className="ml-auto max-w-sm text-sm text-muted-foreground">
                  {service.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
