'use client';

import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface EarthProps {
  radius?: number;
}

export const Earth: React.FC<EarthProps> = ({ radius = 1.75 }) => {
  // Load official NASA Blue Marble Earth maps
  const dayMap = useTexture('/textures/earth_daymap.jpg');
  const normalMap = useTexture('/textures/earth_normal.jpg');

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
  }, [dayMap, normalMap]);

  return (
    <mesh castShadow receiveShadow>
      {/* 128x128 segment sphere geometry */}
      <sphereGeometry args={[radius, 128, 128]} />
      <meshStandardMaterial
        map={dayMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.5, 0.5)}
        roughness={0.65}
        metalness={0.0}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};
