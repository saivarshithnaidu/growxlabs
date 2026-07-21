'use client';

import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

interface EarthProps {
  radius?: number;
}

export const Earth: React.FC<EarthProps> = ({ radius = 1.75 }) => {
  const [dayMap, setDayMap] = useState<THREE.Texture | null>(null);
  const [normalMap, setNormalMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    loader.load('/textures/earth_daymap.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(1, 1);
      tex.needsUpdate = true;
      setDayMap(tex);
    });

    loader.load('/textures/earth_normal.jpg', (norm) => {
      norm.wrapS = THREE.RepeatWrapping;
      norm.wrapT = THREE.ClampToEdgeWrapping;
      norm.repeat.set(1, 1);
      norm.needsUpdate = true;
      setNormalMap(norm);
    });
  }, []);

  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 128, 128]} />
      {dayMap ? (
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap || undefined}
          normalScale={new THREE.Vector2(0.4, 0.4)}
          roughness={0.65}
          metalness={0.0}
          side={THREE.FrontSide}
        />
      ) : (
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      )}
    </mesh>
  );
};
