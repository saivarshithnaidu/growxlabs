'use client';

import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

interface EarthProps {
  radius?: number;
}

const LOCAL_TEXTURE_URL = '/textures/earth_daymap.jpg';
const CDN_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_day_4096.jpg';

export const Earth: React.FC<EarthProps> = ({ radius = 1.75 }) => {
  const [dayMap, setDayMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTexture = (url: string, fallbackUrl?: string) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (tex) => {
          if (!isMounted) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.repeat.set(1, 1);
          tex.needsUpdate = true;
          setDayMap(tex);
        },
        undefined,
        (err) => {
          console.warn(`Failed to load texture from ${url}, trying fallback...`, err);
          if (fallbackUrl && isMounted) {
            loadTexture(fallbackUrl);
          }
        }
      );
    };

    loadTexture(LOCAL_TEXTURE_URL, CDN_TEXTURE_URL);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <mesh castShadow receiveShadow>
      {/* 128x128 segment geometry */}
      <sphereGeometry args={[radius, 128, 128]} />
      {dayMap ? (
        <meshBasicMaterial
          map={dayMap}
          side={THREE.FrontSide}
        />
      ) : (
        <meshBasicMaterial color="#1d4ed8" />
      )}
    </mesh>
  );
};
