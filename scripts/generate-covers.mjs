#!/usr/bin/env node
/**
 * Generates abstract SVG cover art for the demo case studies.
 * Deterministic per slug — re-run any time: `node scripts/generate-covers.mjs`
 * Replace these with real project imagery on client work.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "covers");
mkdirSync(outDir, { recursive: true });

const PROJECTS = [
  { slug: "quickplay-cms", a: "#ff4d00", b: "#c9c7bf", shape: "dashboard" },
  // symposium-website now uses real imagery from its own live deployment (see content/case-studies.ts)
];

// tiny seeded PRNG so output is stable across runs
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seedOf = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0);

function shapeSvg(shape, a, b, rnd, variant) {
  const cx = 400 + rnd() * 800;
  const cy = 300 + rnd() * 600;
  switch (shape) {
    case "ring":
      return `<circle cx="${cx}" cy="${cy}" r="${260 + variant * 60}" fill="none" stroke="${a}" stroke-width="2" opacity="0.8"/>
      <circle cx="${cx}" cy="${cy}" r="${180 + variant * 40}" fill="none" stroke="${b}" stroke-width="1" opacity="0.5"/>`;
    case "bars":
      return Array.from({ length: 14 })
        .map((_, i) => {
          const h = 120 + rnd() * 620;
          return `<rect x="${180 + i * 90}" y="${1100 - h}" width="3" height="${h}" fill="${i % 4 === 0 ? a : b}" opacity="${0.35 + rnd() * 0.5}"/>`;
        })
        .join("\n");
    case "orbit":
      return `<ellipse cx="800" cy="600" rx="${520 - variant * 80}" ry="${170 + variant * 40}" fill="none" stroke="${a}" stroke-width="1.5" opacity="0.7" transform="rotate(${-18 + variant * 14} 800 600)"/>
      <circle cx="${cx}" cy="${cy}" r="14" fill="${b}"/>`;
    case "arc":
      return `<path d="M 200 ${900 + variant * 40} Q 800 ${140 + variant * 90} 1400 ${900 + variant * 40}" fill="none" stroke="${a}" stroke-width="2" opacity="0.85"/>
      <path d="M 320 ${980 + variant * 20} Q 800 ${320 + variant * 70} 1280 ${980 + variant * 20}" fill="none" stroke="${b}" stroke-width="1" opacity="0.5"/>`;
    case "grid":
      return Array.from({ length: 8 })
        .flatMap((_, r) =>
          Array.from({ length: 11 }).map((_, c) => {
            const on = rnd() > 0.55;
            return on
              ? `<circle cx="${240 + c * 112}" cy="${260 + r * 100}" r="${2.5 + rnd() * 3}" fill="${rnd() > 0.8 ? a : b}" opacity="${0.4 + rnd() * 0.5}"/>`
              : "";
          }),
        )
        .join("\n");
    case "star":
      return Array.from({ length: 26 })
        .map(() => {
          const x = 120 + rnd() * 1360;
          const y = 120 + rnd() * 960;
          return `<circle cx="${x}" cy="${y}" r="${1 + rnd() * 2.6}" fill="${rnd() > 0.85 ? a : "#e9e7e2"}" opacity="${0.3 + rnd() * 0.6}"/>`;
        })
        .join("\n");
    case "dashboard": {
      // Abstract CMS wireframe: nav rail, content list rows, metadata
      // panel, small schedule grid — meaningful shapes, no literal UI text.
      const rows = Array.from({ length: 6 })
        .map((_, i) => {
          const y = 260 + i * 110;
          const w = 420 + rnd() * 260;
          return `<rect x="260" y="${y}" width="${w}" height="14" rx="7" fill="${i === 1 ? a : b}" opacity="${i === 1 ? 0.85 : 0.35}"/>
      <rect x="260" y="${y + 26}" width="${w * 0.55}" height="8" rx="4" fill="${b}" opacity="0.22"/>`;
        })
        .join("\n");
      const rail = Array.from({ length: 5 })
        .map((_, i) => `<rect x="120" y="${260 + i * 70}" width="70" height="10" rx="5" fill="${i === 0 ? a : "#e9e7e2"}" opacity="${i === 0 ? 0.8 : 0.25}"/>`)
        .join("\n");
      const panel = Array.from({ length: 4 })
        .map((_, i) => `<rect x="1180" y="${280 + i * 90}" width="${170 - i * 10}" height="12" rx="6" fill="${a}" opacity="${0.5 - i * 0.08}"/>`)
        .join("\n");
      const grid = Array.from({ length: 7 })
        .map((_, i) => `<rect x="${1170 + i * 30}" y="900" width="22" height="22" rx="4" fill="${rnd() > 0.6 ? a : "#e9e7e2"}" opacity="${rnd() > 0.6 ? 0.6 : 0.15}"/>`)
        .join("\n");
      return `<rect x="80" y="180" width="1440" height="900" rx="18" fill="none" stroke="${b}" stroke-width="1.5" opacity="0.4"/>
      <line x1="80" y1="240" x2="1520" y2="240" stroke="${b}" stroke-width="1" opacity="0.3"/>
      ${rail}
      ${rows}
      ${panel}
      ${grid}`;
    }
    default:
      return "";
  }
}

function makeSvg({ slug, a, b, shape }, variant) {
  const rnd = mulberry32(seedOf(slug) * 31 + variant * 7919);
  const bx = 300 + rnd() * 1000;
  const by = 200 + rnd() * 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200">
  <defs>
    <radialGradient id="ga" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${a}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gb" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${b}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${b}" stop-opacity="0"/>
    </radialGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="1600" height="1200" fill="#0e0e11"/>
  <circle cx="${bx}" cy="${by}" r="620" fill="url(#ga)"/>
  <circle cx="${1600 - bx}" cy="${1200 - by}" r="540" fill="url(#gb)"/>
  ${shapeSvg(shape, a, b, rnd, variant)}
  <rect width="1600" height="1200" filter="url(#noise)"/>
</svg>`;
}

for (const project of PROJECTS) {
  for (const variant of [0, 1, 2]) {
    const name =
      variant === 0 ? `${project.slug}.svg` : `${project.slug}-${variant}.svg`;
    writeFileSync(join(outDir, name), makeSvg(project, variant));
    console.log(`✓ public/covers/${name}`);
  }
}
console.log("Done — covers regenerated.");
