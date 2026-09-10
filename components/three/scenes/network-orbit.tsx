"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { themeColors } from "@/lib/theme-colors";

/**
 * The hub — represents the shared CMS platform. A distorted, breathing
 * icosahedron so it still reads as "alive" without being a literal object.
 */
function Hub() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const s = 0.95 * (1 + Math.sin(t * 0.6) * 0.025);
    mesh.scale.setScalar(s);
    mesh.rotation.y += delta * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 32]} />
      <MeshDistortMaterial
        color="#2a2a32"
        distort={0.18}
        speed={1.2}
        roughness={0.25}
        metalness={0.75}
      />
    </mesh>
  );
}

interface NodeConfig {
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  accent: boolean;
}

/**
 * A single orbiting node — one client on the platform. Connected to the
 * hub by a thin line that updates every frame so it always tracks the
 * node's current position.
 */
function OrbitNode({ radius, speed, phase, tilt, accent }: NodeConfig) {
  const nodeRef = useRef<THREE.Mesh>(null);
  const lineGeomRef = useRef<THREE.BufferGeometry>(null);
  // Safe to compute during render — this is a memoized value, not a ref read.
  const initialPoints = useMemo(
    () => new Float32Array([0, 0, 0, radius, 0, 0]),
    [radius],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 1.3 + phase) * 0.12 * radius;

    // apply orbital tilt
    const y2 = y * Math.cos(tilt) - z * Math.sin(tilt) * 0.4;
    const z2 = z * Math.cos(tilt) + y * Math.sin(tilt) * 0.4;

    if (nodeRef.current) {
      nodeRef.current.position.set(x, y2, z2);
    }
    const geom = lineGeomRef.current;
    const posAttr = geom?.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (posAttr) {
      posAttr.setXYZ(1, x, y2, z2);
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh ref={nodeRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={accent ? themeColors.accent() : "#c9c7bf"}
          emissive={accent ? themeColors.accent() : "#c9c7bf"}
          emissiveIntensity={accent ? 1.1 : 0.35}
          roughness={0.4}
        />
      </mesh>
      <line>
        <bufferGeometry ref={lineGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[initialPoints, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#5a5a63" transparent opacity={0.35} />
      </line>
    </group>
  );
}

/** Shared cinematic light rig. */
export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight
        position={[3.5, 2.5, 3.5]}
        intensity={65}
        color={themeColors.accent()}
      />
      <pointLight position={[-4, -2, 2.5]} intensity={35} color="#7d86ff" />
      <pointLight position={[0, 3, -3]} intensity={22} color="#ffffff" />
    </>
  );
}

/**
 * The hero scene: a central hub (the shared CMS platform) with orbiting
 * client nodes connected by live-updating lines — a literal picture of
 * "one platform, several broadcast and OTT clients," instead of a
 * decorative, unrelated space scene.
 */
export function NetworkOrbitScene() {
  const nodes = useMemo<NodeConfig[]>(
    () => [
      { radius: 1.9, speed: 0.22, phase: 0.0, tilt: 0.1, accent: true },
      { radius: 2.3, speed: -0.16, phase: 1.1, tilt: -0.25, accent: false },
      { radius: 1.6, speed: 0.31, phase: 2.4, tilt: 0.4, accent: false },
      { radius: 2.6, speed: -0.12, phase: 3.3, tilt: -0.05, accent: false },
      { radius: 2.0, speed: 0.19, phase: 4.5, tilt: 0.3, accent: false },
      { radius: 2.45, speed: -0.24, phase: 5.2, tilt: -0.35, accent: false },
      { radius: 1.75, speed: 0.27, phase: 0.7, tilt: 0.18, accent: false },
    ],
    [],
  );

  return (
    <group position={[2.1, 0.35, -0.6]} scale={1.15}>
      <SceneLights />
      <Hub />
      {nodes.map((n, i) => (
        <OrbitNode key={i} {...n} />
      ))}
      <fog attach="fog" args={["#0a0a0b", 6, 15]} />
    </group>
  );
}
