"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

// ─── A single glassy tile ──────────────────────────────────────────────────────

function GlassTile({
  position,
  rotation,
  scale,
  color,
  speed,
  floatIntensity,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  floatIntensity: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    mesh.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.08;
    mesh.current.rotation.y = rotation[1] + t * 0.12;
    mesh.current.rotation.z = rotation[2] + Math.cos(t * 0.4) * 0.05;
  });

  return (
    <Float
      speed={speed * 1.5}
      rotationIntensity={0.2}
      floatIntensity={floatIntensity}
    >
      <RoundedBox
        ref={mesh}
        args={[1, 1, 0.1]}
        radius={0.12}
        smoothness={4}
        position={position}
        scale={scale}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </RoundedBox>
    </Float>
  );
}

// ─── Orbiting ring ─────────────────────────────────────────────────────────────

function OrbitRing() {
  const ring = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ring.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3 + 0.8;
    ring.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <mesh ref={ring}>
      <torusGeometry args={[2.8, 0.012, 16, 120]} />
      <meshStandardMaterial
        color="#7B6EF6"
        emissive="#7B6EF6"
        emissiveIntensity={1.2}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

// ─── Second subtler ring ────────────────────────────────────────────────────────

function OrbitRing2() {
  const ring = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ring.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.18) * 0.4 + 0.5;
    ring.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <mesh ref={ring}>
      <torusGeometry args={[3.6, 0.008, 16, 120]} />
      <meshStandardMaterial
        color="#C49A3C"
        emissive="#C49A3C"
        emissiveIntensity={0.8}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────────

function Scene() {
  const tiles = [
    { position: [-2.2,  1.2, -1] as [number,number,number], rotation: [0.4, 0.3, 0.2] as [number,number,number], scale: 1.1, color: "#7B6EF6", speed: 0.4, floatIntensity: 0.6 },
    { position: [ 2.4,  0.8, -2] as [number,number,number], rotation: [-0.3, 0.5, 0.1] as [number,number,number], scale: 0.85, color: "#9D93FF", speed: 0.35, floatIntensity: 0.8 },
    { position: [-1.5, -1.8, -1.5] as [number,number,number], rotation: [0.6, -0.4, 0.3] as [number,number,number], scale: 0.7, color: "#C49A3C", speed: 0.5, floatIntensity: 1.0 },
    { position: [ 1.8, -1.4, -0.5] as [number,number,number], rotation: [-0.2, 0.6, -0.2] as [number,number,number], scale: 0.6, color: "#7B6EF6", speed: 0.45, floatIntensity: 0.7 },
    { position: [ 0.2,  2.5, -2] as [number,number,number], rotation: [0.3, -0.3, 0.5] as [number,number,number], scale: 0.5, color: "#BDB8FF", speed: 0.3, floatIntensity: 0.5 },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]}  intensity={1.5} color="#7B6EF6" />
      <pointLight position={[-3, -2, 2]} intensity={1.0} color="#C49A3C" />
      <pointLight position={[0, 0, 4]}  intensity={0.6} color="#ffffff" />

      {tiles.map((t, i) => (
        <GlassTile key={i} {...t} />
      ))}

      <OrbitRing />
      <OrbitRing2 />
    </>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────

export function FloatingCards3D() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
