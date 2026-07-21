'use client';

import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

interface EarthProps {
  radius?: number;
}

export const Earth: React.FC<EarthProps> = ({ radius = 1.75 }) => {
  const [dayMap, setDayMap] = useState<THREE.Texture | null>(null);

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
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[radius, 128, 128]} />
      {dayMap ? (
        <meshBasicMaterial
          map={dayMap}
          side={THREE.FrontSide}
        />
      ) : (
        <meshBasicMaterial color="#1e3a8a" />
      )}
    </mesh>
  );
};
