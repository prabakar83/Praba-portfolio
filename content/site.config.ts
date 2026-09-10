/**
 * ─────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the single file to edit for every new client.
 *  Brand, copy, SEO defaults, socials and nav all live here.
 *  Colors & fonts live in `app/globals.css` (CSS variables).
 * ─────────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  /** Brand name — used in navbar, footer, metadata, OG image */
  name: "Prabakar M",
  /** Legal / long-form name for JSON-LD */
  legalName: "Prabakar Madhanagopal",
  /** One-line positioning, shown in hero + metadata */
  tagline: "React developer building CMS platforms for OTT and broadcast media",
  /** SEO description */
  description:
    "Prabakar M is a React developer with 2+ years building CMS platforms used across OTT and broadcast media clients. React, TypeScript, GraphQL, Micro Frontend architecture.",
  /** Production URL — used for canonical, sitemap, OG. [NEEDS USER INPUT] once deployed. */
  url: "https://prabakar-m.vercel.app",
  /** Contact */
  email: "Prabakarmadhanagopal@gmail.com",
  location: "Chennai, India",
  /** Year current role started — kept the "since" field/label from AETHER, repointed to a real date */
  since: 2024,

  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    // { label: "Design System", href: "/design-system" },
  ] as const,

  /** [NEEDS USER INPUT] — add X/portfolio links if you want them here */
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/prabakar-m-41b3b7220/" },
  ] as const,

  hero: {
    /** Each entry is one line of the display title */
    titleLines: ["Interfaces", "for what", "millions watch"] as const,
    subtitle:
      "I build and harden the React interfaces broadcast and OTT teams use to publish, schedule and manage content — currently shipping CMS features at Quickplay Media.",
    cta: { label: "See the work", href: "/work" },
  },

  /** AETHER's marquee held fictional client logos — this one holds the real stack + employer, since I don't have a client roster to show */
  clients: [
    "REACT",
    "TYPESCRIPT",
    "GRAPHQL",
    "NODE.JS",
    "QUICKPLAY MEDIA",
    "PRIMESOFT SOLUTIONS",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
