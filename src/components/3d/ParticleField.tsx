"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Individual particle system ────────────────────────────────────────────────

function Particles({ count = 280 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);
  const time = useRef(0);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Primary violet color
    const violetColor = new THREE.Color("#7B6EF6");
    // Secondary gold color
    const goldColor = new THREE.Color("#C49A3C");
    // Dim blue
    const blueColor = new THREE.Color("#4A4A9E");

    for (let i = 0; i < count; i++) {
      // Spread across a wide space
      pos[i * 3]     = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Vary colors: 65% violet, 20% dim blue, 15% gold
      const r = Math.random();
      const c = r < 0.65 ? violetColor : r < 0.85 ? blueColor : goldColor;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    time.current += delta * 0.12;
    if (!mesh.current) return;
    mesh.current.rotation.y = time.current * 0.06;
    mesh.current.rotation.x = Math.sin(time.current * 0.04) * 0.08;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Floating geometric shapes ─────────────────────────────────────────────────

function FloatingOrb({
  position,
  radius,
  speed,
  color,
  wireframe = false,
}: {
  position: [number, number, number];
  radius: number;
  speed: number;
  color: string;
  wireframe?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const origin = useRef(position);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    mesh.current.position.x = origin.current[0] + Math.sin(t) * 0.4;
    mesh.current.position.y = origin.current[1] + Math.cos(t * 0.8) * 0.3;
    mesh.current.rotation.x += 0.003;
    mesh.current.rotation.y += 0.005;
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[radius, 1]} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={wireframe ? 0.18 : 0.08}
        emissive={color}
        emissiveIntensity={wireframe ? 0.4 : 0.15}
      />
    </mesh>
  );
}

// ─── Main scene ────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#7B6EF6" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#C49A3C" />

      <Particles count={300} />

      {/* Wireframe polyhedra */}
      <FloatingOrb position={[5.5, 2, -3]}   radius={1.2} speed={0.35} color="#7B6EF6" wireframe />
      <FloatingOrb position={[-5, -1.5, -2]} radius={0.9} speed={0.28} color="#9D93FF" wireframe />
      <FloatingOrb position={[2, -3, -4]}    radius={0.7} speed={0.45} color="#C49A3C" wireframe />

      {/* Solid glowing orbs */}
      <FloatingOrb position={[-3, 2.5, -5]}  radius={0.5} speed={0.22} color="#7B6EF6" />
      <FloatingOrb position={[6,  -2, -6]}   radius={0.4} speed={0.38} color="#C49A3C" />
    </>
  );
}

// ─── Exported component ────────────────────────────────────────────────────────

export function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
