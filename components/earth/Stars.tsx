'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DeepSpaceStarsProps {
  count?: number;
}

export const DeepSpaceStars: React.FC<DeepSpaceStarsProps> = ({ count = 35000 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 35,000 particle stars with positions, colors, sizes, and parallax speeds
  const { positions, colors, sizes, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const spd = new Float32Array(count);

    // Palette: 88% Pure White, 6% Soft Cyan, 4% Soft Blue, 2% Warm Gold
    const colorWhite = new THREE.Color('#ffffff');
    const colorCyan = new THREE.Color('#a5f3fc');
    const colorBlue = new THREE.Color('#93c5fd');
    const colorGold = new THREE.Color('#fef08a');

    for (let i = 0; i < count; i++) {
      // 3D Bounding volume: X [-200, 200], Y [-200, 200], Z [-320, 20]
      const x = (Math.random() - 0.5) * 400;
      const y = (Math.random() - 0.5) * 400;
      const z = -Math.random() * 340 + 20;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color selection (mostly white, minimal elegant tints)
      const randColor = Math.random();
      let selectedColor = colorWhite;
      if (randColor > 0.98) selectedColor = colorGold;
      else if (randColor > 0.94) selectedColor = colorBlue;
      else if (randColor > 0.88) selectedColor = colorCyan;

      col[i * 3] = selectedColor.r;
      col[i * 3 + 1] = selectedColor.g;
      col[i * 3 + 2] = selectedColor.b;

      // Size & Speed parallax layers
      const randType = Math.random();
      if (randType > 0.95) {
        // Large bright foreground stars
        sz[i] = Math.random() * 3.5 + 3.0;
        spd[i] = Math.random() * 0.2 + 0.35;
      } else if (randType > 0.70) {
        // Medium midground stars
        sz[i] = Math.random() * 1.5 + 1.8;
        spd[i] = Math.random() * 0.1 + 0.18;
      } else {
        // Tiny distant background stars
        sz[i] = Math.random() * 0.8 + 0.8;
        spd[i] = Math.random() * 0.05 + 0.08;
      }
    }

    return {
      positions: pos,
      colors: col,
      sizes: sz,
      speeds: spd,
    };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    const deltaFactor = Math.min(delta, 0.1) * 60; // Normalize delta to 60 FPS target

    for (let i = 0; i < count; i++) {
      let z = array[i * 3 + 2];
      z += speeds[i] * 0.45 * deltaFactor;

      // When star passes camera (+20), respawn far in background (-320) for endless journey
      if (z > 20) {
        z = -320;
        array[i * 3] = (Math.random() - 0.5) * 400;
        array[i * 3 + 1] = (Math.random() - 0.5) * 400;
      }

      array[i * 3 + 2] = z;
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2.2}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const Stars = DeepSpaceStars;
