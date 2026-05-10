"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Distorted glowing sphere ──────────────────────────────────────────────────

function GlowSphere() {
  const sphere = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    sphere.current.rotation.x = state.clock.elapsedTime * 0.12;
    sphere.current.rotation.y = state.clock.elapsedTime * 0.18;
  });

  return (
    <Sphere ref={sphere} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#7B6EF6"
        attach="material"
        distort={0.35}
        speed={2.5}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.85}
        emissive="#4A3FCC"
        emissiveIntensity={0.6}
      />
    </Sphere>
  );
}

// ─── Gold satellite ring ───────────────────────────────────────────────────────

function SatelliteRing() {
  const ring = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ring.current.rotation.x = state.clock.elapsedTime * 0.3 + 1.2;
    ring.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <mesh ref={ring}>
      <torusGeometry args={[1.65, 0.025, 16, 100]} />
      <meshStandardMaterial
        color="#C49A3C"
        emissive="#C49A3C"
        emissiveIntensity={1.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// ─── Outer wireframe icosahedron ───────────────────────────────────────────────

function WireframeShell() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.08;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshStandardMaterial
        color="#9D93FF"
        wireframe
        transparent
        opacity={0.12}
        emissive="#9D93FF"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// ─── Main scene ────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]}   intensity={2} color="#7B6EF6" />
      <pointLight position={[-2, -2, 2]} intensity={1} color="#C49A3C" />
      <pointLight position={[0, 0, 3]}   intensity={0.8} color="#ffffff" />

      <GlowSphere />
      <SatelliteRing />
      <WireframeShell />
    </>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────

/**
 * A luxury 3D glowing sphere with orbiting gold ring.
 * Drop this anywhere as a decorative element.
 */
export function GlowOrb3D({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
