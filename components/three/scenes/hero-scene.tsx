"use client";

import { NetworkOrbitScene } from "./network-orbit";
import { ParticleField } from "./particle-field";

/**
 * Hero background: a central hub with orbiting client nodes (see
 * network-orbit.tsx) — a literal picture of one shared CMS platform
 * serving several broadcast/OTT clients — with a sparse particle
 * field behind it for depth, not a decorative starfield.
 */
export function HeroScene() {
  return (
    <>
      <NetworkOrbitScene />
      <ParticleField count={900} spread={[11, 6, 3]} />
    </>
  );
}
