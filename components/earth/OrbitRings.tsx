'use client';

import React from 'react';
import * as THREE from 'three';
import { EARTH_COLORS } from '@/lib/three';

interface OrbitRingsProps {
  ringsRef?: React.RefObject<THREE.Group | null>;
}

export const OrbitRings: React.FC<OrbitRingsProps> = ({ ringsRef }) => {
  return (
    <group ref={ringsRef}>
      {/* Primary Equatorial Orbit Ring */}
      <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
        <ringGeometry args={[2.8, 2.815, 128]} />
        <meshBasicMaterial
          color={EARTH_COLORS.atmosphere}
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary Tilted Polar Orbit Ring */}
      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0.4]}>
        <ringGeometry args={[3.2, 3.212, 128]} />
        <meshBasicMaterial
          color={EARTH_COLORS.atmosphere}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Subtle Orbit Ring */}
      <mesh rotation={[-Math.PI / 3, -0.3, 0.2]}>
        <ringGeometry args={[3.7, 3.71, 128]} />
        <meshBasicMaterial
          color={EARTH_COLORS.atmosphere}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
