'use client';

import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface EarthProps {
  radius?: number;
}

export const Earth: React.FC<EarthProps> = ({ radius = 1.75 }) => {
  // Load official NASA Earth texture maps
  const dayMap = useTexture('/textures/earth_daymap.jpg');
  const normalMap = useTexture('/textures/earth_normal.jpg');
  const specularMap = useTexture('/textures/earth_specular.jpg');

  useLayoutEffect(() => {
    // Debug step 4: Log every loaded texture
    console.log('dayMap:', dayMap);
    console.log('normalMap:', normalMap);
    console.log('specularMap:', specularMap);

    if (dayMap) {
      dayMap.colorSpace = THREE.SRGBColorSpace;
      dayMap.wrapS = THREE.RepeatWrapping;
      dayMap.wrapT = THREE.ClampToEdgeWrapping;
      dayMap.repeat.set(1, 1);
      dayMap.needsUpdate = true;
    }
    if (normalMap) {
      normalMap.wrapS = THREE.RepeatWrapping;
      normalMap.wrapT = THREE.ClampToEdgeWrapping;
      normalMap.repeat.set(1, 1);
      normalMap.needsUpdate = true;
    }
    if (specularMap) {
      specularMap.wrapS = THREE.RepeatWrapping;
      specularMap.wrapT = THREE.ClampToEdgeWrapping;
      specularMap.repeat.set(1, 1);
      specularMap.needsUpdate = true;
    }
  }, [dayMap, normalMap, specularMap]);

  return (
    <mesh castShadow receiveShadow>
      {/* 128x128 segments */}
      <sphereGeometry args={[radius, 128, 128]} />
      {/* Step 5: Render ONLY dayMap first */}
      <meshStandardMaterial
        map={dayMap}
        metalness={0}
        roughness={1}
      />
    </mesh>
  );
};
