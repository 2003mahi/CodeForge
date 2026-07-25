"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 3000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8B5CF6"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function NeuralNodes() {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      scale: Math.random() * 0.06 + 0.03,
      color: Math.random() > 0.5 ? "#7C3AED" : "#3B82F6",
    }));
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.07;
      group.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
      });
    }
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.scale, 8, 8]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <NeuralNodes />
      </Canvas>
    </div>
  );
}
