"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { themeColors } from "@/lib/theme-colors";

interface AuroraBlobProps {
  position?: [number, number, number];
  scale?: number;
  /** 0–1 — how liquid the surface is */
  distort?: number;
  color?: string;
}

/**
 * Organic distorted sphere that slowly breathes and tilts toward the
 * pointer. Lit by the accompanying rig in `<SceneLights />`.
 */
export function AuroraBlob({
  position = [0, 0, 0],
  scale = 1.6,
  distort = 0.42,
  color,
}: AuroraBlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // breathe
    const t = state.clock.elapsedTime;
    const s = scale * (1 + Math.sin(t * 0.5) * 0.03);
    mesh.scale.setScalar(s);
    // tilt toward pointer, heavily damped
    const targetX = state.pointer.y * 0.4;
    const targetY = state.pointer.x * 0.6 + t * 0.05;
    mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, targetX, 2, delta);
    mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, targetY, 2, delta);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[1, 48]} />
      <MeshDistortMaterial
        color={color ?? "#34343e"}
        distort={distort}
        speed={1.6}
        roughness={0.22}
        metalness={0.72}
      />
    </mesh>
  );
}

/** Shared cinematic light rig: warm accent key + cool rim. */
export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight
        position={[3.5, 2.5, 3.5]}
        intensity={70}
        color={themeColors.accent()}
      />
      <pointLight position={[-4, -2, 2.5]} intensity={40} color="#7d86ff" />
      <pointLight position={[0, 3, -3]} intensity={25} color="#ffffff" />
    </>
  );
}
