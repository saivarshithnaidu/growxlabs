'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Earth } from './Earth';
import { Atmosphere } from './Atmosphere';
import { Clouds } from './Clouds';
import { Stars } from './Stars';
import { OrbitRings } from './OrbitRings';
import { Particles } from './Particles';
import { useEarthRotation } from '@/hooks/useEarthRotation';
import { EARTH_COLORS } from '@/lib/three';

const SUN_POSITION: [number, number, number] = [5, 3, 5];

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();
    // Very subtle camera float
    camera.position.x = Math.sin(time * 0.08) * 0.04;
    camera.position.y = 0.2 + Math.cos(time * 0.1) * 0.03;
    camera.lookAt(0, -0.2, 0);
  });
  return null;
}

function GlobeContent() {
  const { earthGroupRef, cloudsRef, ringsRef, bindInteractions } = useEarthRotation();

  return (
    <group ref={earthGroupRef} position={[0, -0.35, 0]} {...bindInteractions}>
      {/* 1. Earth Body (Surface skin: dayMap + normalMap + light direction day/night blending) */}
      <Earth radius={1.75} sunPosition={SUN_POSITION} />

      {/* 2. Cloud Sphere (1.01x scale = 1.7675 radius, 35% opacity) */}
      <Clouds radius={1.7675} cloudsRef={cloudsRef} />

      {/* 3. Atmosphere Layer (1.02x scale = 1.785 radius, Fresnel BackSide shader) */}
      <Atmosphere radius={1.785} />

      {/* 4. Minimal Orbit Rings (< 3% opacity) */}
      <OrbitRings ringsRef={ringsRef} />
    </group>
  );
}

export function EarthScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] sm:min-h-[640px] md:min-h-[720px] select-none bg-[#050505]"
    >
      <Canvas
        camera={{ position: [0, 0.2, 5.6], fov: 34 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        className="w-full h-full bg-[#050505]"
      >
        <color attach="background" args={[EARTH_COLORS.background]} />

        {/* Sun Directional Light at (5, 3, 5) + Subtle AmbientLight 0.25 */}
        <ambientLight intensity={0.25} />
        <directionalLight
          position={SUN_POSITION}
          intensity={2.2}
          color="#ffffff"
        />

        <CameraRig />

        <Suspense fallback={null}>
          <GlobeContent />
          <Stars count={1200} />
          <Particles count={100} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.4}
          dampingFactor={0.05}
          enableDamping
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
        />
      </Canvas>
    </div>
  );
}

export default EarthScene;
