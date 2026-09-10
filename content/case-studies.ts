/**
 * Mock case-study content — swap with real client work per project.
 * Covers are procedural SVGs from `scripts/generate-covers.mjs`.
 */

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  year: number;
  categories: string[];
  services: string[];
  cover: string;
  coverFit?: "cover" | "contain";
  gallery: string[];
  /** Accent color used for hover states on this project */
  accent: string;
  tagline: string;
  intro: string;
  challenge: string;
  approach: string;
  results: { value: string; label: string }[];
  website?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "quickplay-cms",
    title: "OTT Content Management System",
    client: "Quickplay Media / Primesoft Solutions",
    year: 2024,
    categories: ["CMS", "Frontend Engineering"],
    services: ["React Development", "API Integration", "Micro Frontend Architecture"],
    cover: "/covers/quickplay-cms.svg",
    gallery: ["/covers/quickplay-cms-1.svg", "/covers/quickplay-cms-2.svg"],
    accent: "#ff4d00",
    tagline: "The CMS that broadcast teams open every morning",
    intro:
      "A React-based Content Management System used to manage OTT platform content — media assets, metadata, and scheduling — across 7+ broadcast and OTT clients. I work on it as a Software Developer at Primesoft Solutions, embedded on-site with Quickplay Media.",
    challenge:
      "The platform serves 7+ concurrent client accounts, so changes for one client can't be allowed to break another's release. On top of that, the app was carrying React 16 and Node.js 16 into a codebase that needed to keep shipping.",
    approach:
      "I build modular, independently deployable UI components using React, TypeScript, and Micro Frontend architecture (Module Federation), which cut down cross-team deployment conflicts. I integrate GraphQL and REST APIs for dynamic content, and led the production upgrade from React 16 to 18 and Node.js 16 to 20 without disrupting ongoing delivery. A QA background before this role means I catch a lot of edge cases in development rather than after release.",
    results: [
      { value: "7+", label: "Broadcast & OTT clients on one platform" },
      { value: "16 → 18", label: "React version upgraded in production" },
      { value: "2024 →", label: "Ongoing role" },
    ],
  },
  {
    slug: "symposium-website",
    title: "Symposium Website",
    client: "St. Joseph's College of Engineering",
    year: 2023,
    categories: ["Web", "Frontend"],
    services: ["Frontend Development", "Responsive Design"],
    cover: "https://jetsignum2023.vercel.app/images/ttl.png",
    coverFit: "contain",
    gallery: [
      "https://jetsignum2023.vercel.app/images/ttl.png",
      "https://jetsignum2023.vercel.app/images/logoback.png",
    ],
    accent: "#7d5cff",
    tagline: "A registration site for a college technical symposium, built to make event details easy to find",
    intro:
      "A team-built website for a college-wide symposium, replacing static flyers with a live, browsable event schedule and speaker directory.",
    challenge:
      "Students needed to find session times and speaker details quickly, on phones, without digging through a PDF program.",
    approach:
      "I owned frontend/UI development within a small team, from design through live deployment, and built a responsive navigation system with CSS media queries to reduce clicks to key event information.",
    results: [
      { value: "Public", label: "Live and browsable" },
      { value: "Team", label: "Built and shipped with classmates" },
    ],
    website: "https://jetsignum2023.vercel.app",
  },
];

export const allCategories = [
  "All",
  ...Array.from(new Set(caseStudies.flatMap((c) => c.categories))),
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getAdjacentCaseStudies(slug: string) {
  const index = caseStudies.findIndex((c) => c.slug === slug);
  return {
    prev: caseStudies[(index - 1 + caseStudies.length) % caseStudies.length],
    next: caseStudies[(index + 1) % caseStudies.length],
  };
}
