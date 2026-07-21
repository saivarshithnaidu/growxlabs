'use client';

import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface EarthProps {
  radius?: number;
}

export const Earth: React.FC<EarthProps> = ({ radius = 2 }) => {
  // Load ONLY official NASA Blue Marble Day map
  const dayTexture = useTexture('/textures/earth_daymap.jpg');

  useLayoutEffect(() => {
    if (dayTexture) {
      dayTexture.colorSpace = THREE.SRGBColorSpace;
      dayTexture.wrapS = THREE.RepeatWrapping;
      dayTexture.wrapT = THREE.ClampToEdgeWrapping;
      dayTexture.repeat.set(1, 1);
      dayTexture.needsUpdate = true;
      console.log('NASA dayTexture loaded successfully:', dayTexture);
    }
  }, [dayTexture]);

  return (
    <mesh castShadow receiveShadow>
      {/* 128x128 segments */}
      <sphereGeometry args={[radius, 128, 128]} />
      <meshStandardMaterial
        map={dayTexture}
        metalness={0}
        roughness={1}
      />
    </mesh>
  );
};
