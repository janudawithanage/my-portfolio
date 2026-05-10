"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";

// ─── Inner glowing sphere ──────────────────────────────────────────────────────

function CoreSphere() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <Sphere ref={mesh} args={[0.55, 32, 32]}>
      <meshStandardMaterial
        color="#7B6EF6"
        emissive="#5347CC"
        emissiveIntensity={0.9}
        roughness={0.2}
        metalness={0.7}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

// ─── Torus rings ───────────────────────────────────────────────────────────────

function Ring({ radius, tube, color, speed, axis }: {
  radius: number;
  tube: number;
  color: string;
  speed: number;
  axis: "x" | "y" | "z";
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (axis === "x") mesh.current.rotation.x = t;
    else if (axis === "y") mesh.current.rotation.y = t;
    else mesh.current.rotation.z = t;
  });
  return (
    <Torus ref={mesh} args={[radius, tube, 16, 80]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        transparent
        opacity={0.65}
        roughness={0.1}
        metalness={0.8}
      />
    </Torus>
  );
}

// ─── Dots orbiting on a ring path ──────────────────────────────────────────────

function OrbitingDots({ count = 5, orbitRadius = 1.3, color = "#C49A3C" }: {
  count?: number;
  orbitRadius?: number;
  color?: string;
}) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    group.current.rotation.z = state.clock.elapsedTime * 0.55;
  });
  const dots = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return [Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0] as [number, number, number];
  });

  return (
    <group ref={group}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]}  intensity={2.5} color="#7B6EF6" />
      <pointLight position={[-2, -1, 1]} intensity={1.5} color="#C49A3C" />

      <CoreSphere />
      <Ring radius={0.95}  tube={0.018} color="#9D93FF" speed={0.9}  axis="x" />
      <Ring radius={1.15}  tube={0.012} color="#7B6EF6" speed={0.65} axis="y" />
      <Ring radius={1.35}  tube={0.009} color="#C49A3C" speed={0.45} axis="z" />
      <OrbitingDots count={6} orbitRadius={1.55} color="#C49A3C" />
    </>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────

export function TechOrb3D({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
