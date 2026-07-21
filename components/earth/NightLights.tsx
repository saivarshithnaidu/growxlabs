'use client';

import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface NightLightsProps {
  radius?: number;
}

export const NightLights: React.FC<NightLightsProps> = ({ radius = 1.752 }) => {
  // Load official NASA Night Lights texture
  const nightMap = useTexture('/textures/earth_night.jpg');

  useLayoutEffect(() => {
    if (nightMap) {
      nightMap.colorSpace = THREE.SRGBColorSpace;
      nightMap.wrapS = THREE.RepeatWrapping;
      nightMap.wrapT = THREE.ClampToEdgeWrapping;
      nightMap.repeat.set(1, 1);
      nightMap.needsUpdate = true;
    }
  }, [nightMap]);

  return (
    <mesh>
      {/* 128x128 segment geometry */}
      <sphereGeometry args={[radius, 128, 128]} />
      <meshBasicMaterial
        map={nightMap}
        blending={THREE.AdditiveBlending}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </mesh>
  );
};
