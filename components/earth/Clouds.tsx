'use client';

import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface CloudsProps {
  radius?: number;
  cloudsRef?: React.RefObject<THREE.Mesh | null>;
}

export const Clouds: React.FC<CloudsProps> = ({
  radius = 1.7675, // Scale 1.01x (1.75 * 1.01)
  cloudsRef,
}) => {
  // Load transparent cloud map
  const cloudMap = useTexture('/textures/earth_clouds.png');

  useLayoutEffect(() => {
    if (cloudMap) {
      cloudMap.colorSpace = THREE.SRGBColorSpace;
      cloudMap.wrapS = THREE.RepeatWrapping;
      cloudMap.wrapT = THREE.ClampToEdgeWrapping;
      cloudMap.repeat.set(1, 1);
      cloudMap.needsUpdate = true;
    }
  }, [cloudMap]);

  return (
    <mesh ref={cloudsRef}>
      {/* 128x128 segment geometry */}
      <sphereGeometry args={[radius, 128, 128]} />
      <meshStandardMaterial
        map={cloudMap}
        transparent
        opacity={0.35}
        depthWrite={false}
        side={THREE.FrontSide}
        roughness={1}
      />
    </mesh>
  );
};
