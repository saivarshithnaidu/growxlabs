'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AtmosphereShader, EARTH_COLORS } from '@/lib/three';

interface AtmosphereProps {
  radius?: number;
  color?: string;
}

export const Atmosphere: React.FC<AtmosphereProps> = ({
  radius = 1.785, // Scale 1.02x (1.75 * 1.02)
  color = EARTH_COLORS.atmosphere,
}) => {
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(color) },
        coefficient: { value: 0.65 },
        power: { value: 5.5 }, // Soft Fresnel atmosphere rim near the edge of the globe
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color]);

  return (
    <mesh>
      {/* 128x128 segment geometry */}
      <sphereGeometry args={[radius, 128, 128]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
};
