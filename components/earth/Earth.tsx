'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { NasaEarthShader } from '@/lib/three';

interface EarthProps {
  radius?: number;
}

export const Earth: React.FC<EarthProps> = ({ radius = 2 }) => {
  // Load official NASA Earth textures
  const [dayMap, nightMap, normalMap, specularMap] = useTexture([
    '/textures/earth_daymap.jpg',
    '/textures/earth_night.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
  ]);

  // Configure texture filters and sRGB color space
  [dayMap, nightMap, normalMap, specularMap].forEach((tex) => {
    if (tex) {
      tex.anisotropy = 16;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
    }
  });

  // Custom Shader Material for NASA Blue Marble
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: NasaEarthShader.vertexShader,
      fragmentShader: NasaEarthShader.fragmentShader,
      uniforms: {
        dayMap: { value: dayMap },
        nightMap: { value: nightMap },
        normalMap: { value: normalMap },
        specularMap: { value: specularMap },
        sunPosition: { value: new THREE.Vector3(5, 3, 5) },
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
