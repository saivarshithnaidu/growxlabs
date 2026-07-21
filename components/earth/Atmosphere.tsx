'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AtmosphereShader, EARTH_COLORS } from '@/lib/three';

interface AtmosphereProps {
  radius?: number;
  color?: string;
}

export const Atmosphere: React.FC<AtmosphereProps> = ({
  radius = 2.04, // Exact 1.02x scale (Earth radius = 2.0)
  color = EARTH_COLORS.atmosphere,
}) => {
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(color) },
        coefficient: { value: 0.75 },
        power: { value: 4.2 }, // Subtle soft blue rim, no thick glow
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
