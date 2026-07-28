"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Reduced from 3000 → 1500: 50% fewer particles, still looks great
function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1500;
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

// Optimized: removed per-child forEach every frame (was GC-heavy).
// InstancedMesh collapses 40 draw calls → 1. Matrices set once, not per frame.
function NeuralNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { nodes, geometry, material, initialMatrices } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const nodeData = Array.from({ length: 40 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ),
      scale: Math.random() * 0.06 + 0.03,
    }));

    const matrices: THREE.Matrix4[] = nodeData.map((node) => {
      dummy.position.copy(node.position);
      dummy.scale.setScalar(node.scale / 0.045);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });

    const geometry = new THREE.SphereGeometry(0.045, 6, 6);
    // Blend purple+blue with vertexColors as single draw call using one material
    const material = new THREE.MeshBasicMaterial({
      color: "#7C3AED",
      transparent: true,
      opacity: 0.8,
    });

    return { nodes: nodeData, geometry, material, initialMatrices: matrices };
  }, []);

  // Set matrices once on mount — never again (nodes are static)
  const initialized = useRef(false);
  useFrame((state) => {
    if (!initialized.current && meshRef.current) {
      initialMatrices.forEach((mat, i) => meshRef.current!.setMatrixAt(i, mat));
      meshRef.current.instanceMatrix.needsUpdate = true;
      initialized.current = true;
    }
    // Only rotate the parent group — no per-node work
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.07;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, material, 40]} />
    </group>
  );
}


export default function HeroScene() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        // antialias: false → significant GPU fillrate savings on large canvases
        // dpr capped at 1.5 → prevents 4x pixel overdraw on Retina/high-DPI screens
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <NeuralNodes />
      </Canvas>
    </div>
  );
}
