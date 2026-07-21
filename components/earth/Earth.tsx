'use client';

import React, { useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface EarthProps {
  radius?: number;
  sunPosition?: [number, number, number];
}

export const Earth: React.FC<EarthProps> = ({
  radius = 1.75,
  sunPosition = [5, 3, 5],
}) => {
  // Load official NASA Earth textures
  const dayMap = useTexture('/textures/earth_daymap.jpg');
  const normalMap = useTexture('/textures/earth_normal.jpg');
  const nightMap = useTexture('/textures/earth_night.jpg');

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
    if (nightMap) {
      nightMap.colorSpace = THREE.SRGBColorSpace;
      nightMap.wrapS = THREE.RepeatWrapping;
      nightMap.wrapT = THREE.ClampToEdgeWrapping;
      nightMap.repeat.set(1, 1);
      nightMap.needsUpdate = true;
    }
  }, [dayMap, normalMap, nightMap]);

  // Create custom shader material that blends day and night based on light direction
  const earthMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: dayMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.FrontSide,
    });

    const sunDir = new THREE.Vector3(...sunPosition).normalize();

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uNightMap = { value: nightMap };
      shader.uniforms.uSunDirection = { value: sunDir };

      // Pass world normal from vertex shader
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec3 vWorldNormal;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `
        #include <worldpos_vertex>
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        `
      );

      // Fragment shader: mix night city lights ONLY on pixels facing away from sun
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform sampler2D uNightMap;
        uniform vec3 uSunDirection;
        varying vec3 vWorldNormal;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        `
        vec3 nightColor = texture2D(uNightMap, vUv).rgb;
        float dayFactor = smoothstep(-0.2, 0.25, dot(vWorldNormal, uSunDirection));
        vec3 finalColor = mix(nightColor * 1.6, outgoingLight, dayFactor);
        gl_FragColor = vec4(finalColor, 1.0);
        `
      );
    };

    return mat;
  }, [dayMap, normalMap, nightMap, sunPosition]);

  return (
    <mesh castShadow receiveShadow material={earthMaterial}>
      {/* 128x128 segment geometry */}
      <sphereGeometry args={[radius, 128, 128]} />
    </mesh>
  );
};
