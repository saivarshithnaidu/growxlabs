'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AtmosphereShader, EARTH_COLORS } from '@/lib/three';

interface AtmosphereProps {
  radius?: number;
  color?: string;
}

export const Atmosphere: React.FC<AtmosphereProps> = ({
  radius = 2.06, // Slightly larger than Earth radius (2.0)
  color = EARTH_COLORS.atmosphere,
}) => {
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(color) },
        coeficient: { value: 0.8 },
        power: { value: 3.5 }, // High power = thin, subtle atmospheric rim
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color]);

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
};
