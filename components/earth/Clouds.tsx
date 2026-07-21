'use client';

import React from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface CloudsProps {
  radius?: number;
  cloudsRef?: React.RefObject<THREE.Mesh | null>;
}

export const Clouds: React.FC<CloudsProps> = ({
  radius = 2.02, // Exact 1.01x scale (Earth radius = 2.0)
  cloudsRef,
}) => {
  // Load transparent PNG cloud texture
  const cloudsMap = useTexture('/textures/earth_clouds.png');

  if (cloudsMap) {
    cloudsMap.anisotropy = 16;
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
  }

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={cloudsMap}
        transparent
        opacity={0.35} // Opacity around 35%
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        roughness={1}
      />
    </mesh>
  );
};
