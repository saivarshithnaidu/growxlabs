'use client';

import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface EarthProps {
  radius?: number;
}

export const Earth: React.FC<EarthProps> = ({ radius = 1.75 }) => {
  // Load official Three.js NASA Earth maps
  const dayMap = useTexture('/textures/earth_daymap.jpg');
  const normalMap = useTexture('/textures/earth_normal.jpg');
  const specularMap = useTexture('/textures/earth_specular.jpg');

  useLayoutEffect(() => {
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
      {/* 128x128 segment sphere geometry */}
      <sphereGeometry args={[radius, 128, 128]} />
      <meshStandardMaterial
        map={dayMap}
        normalMap={normalMap}
        roughnessMap={specularMap}
        metalness={0.1}
        roughness={0.7}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};
