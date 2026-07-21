'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { EarthShader, EARTH_COLORS } from '@/lib/three';

interface EarthProps {
  radius?: number;
}

export const Earth: React.FC<EarthProps> = ({ radius = 2 }) => {
  // Load textures with fallback handling
  const [dayMap, nightMap, normalMap, specularMap] = useTexture([
    '/textures/earth_daymap.jpg',
    '/textures/earth_nightlights.jpg',
    '/textures/earth_normal.png',
    '/textures/earth_specular.png',
  ]);

  // Configure texture filters for crisp GPU rendering
  [dayMap, nightMap, normalMap, specularMap].forEach((tex) => {
    if (tex) {
      tex.anisotropy = 16;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
    }
  });

  // Custom Earth Shader Material for seamless Day/Night blending
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: EarthShader.vertexShader,
      fragmentShader: EarthShader.fragmentShader,
      uniforms: {
        dayTexture: { value: dayMap },
        nightTexture: { value: nightMap },
        normalMap: { value: normalMap },
        specularMap: { value: specularMap },
        sunPosition: { value: new THREE.Vector3(5, 3, 5) },
        atmosphereColor: { value: new THREE.Color(EARTH_COLORS.atmosphere) },
      },
      blending: THREE.NormalBlending,
    });
  }, [dayMap, nightMap, normalMap, specularMap]);

  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};
