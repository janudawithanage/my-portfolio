"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Points distributed on sphere surface ──────────────────────────────────────

function SkillGlobePoints({ count = 180 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const violetC = new THREE.Color("#7B6EF6");
    const goldC   = new THREE.Color("#C49A3C");
    const blueC   = new THREE.Color("#9D93FF");

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution for even spread
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.3;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const t = Math.random();
      const c = t < 0.6 ? violetC : t < 0.8 ? blueC : goldC;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.22;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.15;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Wireframe sphere shell ─────────────────────────────────────────────────────

function GlobeShell() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.06;
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.32, 24, 18]} />
      <meshStandardMaterial
        color="#7B6EF6"
        wireframe
        transparent
        opacity={0.07}
        emissive="#7B6EF6"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

// ─── Glowing equatorial ring ───────────────────────────────────────────────────

function EquatorialRing() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
    mesh.current.rotation.x = 0.6;
  });
  return (
    <mesh ref={mesh}>
      <torusGeometry args={[1.38, 0.015, 16, 100]} />
      <meshStandardMaterial
        color="#C49A3C"
        emissive="#C49A3C"
        emissiveIntensity={1.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]}  intensity={2} color="#7B6EF6" />
      <pointLight position={[-2, -2, 2]} intensity={1} color="#C49A3C" />
      <SkillGlobePoints count={200} />
      <GlobeShell />
      <EquatorialRing />
    </>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────

export function SkillGlobe3D({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
