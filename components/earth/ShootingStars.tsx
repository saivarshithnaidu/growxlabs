'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ShootingStars() {
  const lineRef = useRef<THREE.Line>(null);
  const [active, setActive] = useState(false);
  const startPos = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const progress = useRef(0);
  const nextSpawnTime = useRef(4);

  const initialPositions = useMemo(() => new Float32Array(6), []);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    if (!active && time >= nextSpawnTime.current) {
      // Spawn a rare shooting star
      const x = (Math.random() - 0.5) * 140;
      const y = Math.random() * 50 + 20;
      const z = -Math.random() * 120 - 40;

      startPos.current.set(x, y, z);

      // Travel diagonally downward across deep space
      velocity.current.set(
        (Math.random() - 0.5) * 70 - 35,
        -Math.random() * 60 - 40,
        Math.random() * 25 + 15
      );

      progress.current = 0;
      setActive(true);
      nextSpawnTime.current = time + Math.random() * 12 + 10; // Rare spawn every 10 to 22 seconds
    }

    if (active && lineRef.current) {
      progress.current += delta * 1.6; // 0.6s total duration
      if (progress.current >= 1) {
        setActive(false);
      } else {
        const head = startPos.current.clone().addScaledVector(velocity.current, progress.current);
        const tail = startPos.current.clone().addScaledVector(velocity.current, Math.max(0, progress.current - 0.18));

        const positions = new Float32Array([
          tail.x, tail.y, tail.z,
          head.x, head.y, head.z
        ]);

        const attr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
        if (attr) {
          attr.array.set(positions);
          attr.needsUpdate = true;
        }
      }
    }
  });

  if (!active) return null;

  return (
    // @ts-expect-error - JSX element line type collision with SVG line in React types
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#a5f3fc"
        transparent
        opacity={0.65}
        linewidth={1.5}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}
