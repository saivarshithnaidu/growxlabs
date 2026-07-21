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

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();
    // Very subtle floating movement
    camera.position.x = Math.sin(time * 0.1) * 0.08;
    camera.position.y = Math.cos(time * 0.15) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function GlobeContent() {
  const { earthGroupRef, cloudsRef, ringsRef, bindInteractions } = useEarthRotation();

  return (
    <group ref={earthGroupRef} {...bindInteractions}>

      {/* Sphere 1: Earth Body (radius = 2.0) */}
      <Earth radius={2.0} />

      {/* Sphere 2: Clouds (scale 1.01x, radius = 2.02) */}
      <Clouds radius={2.02} cloudsRef={cloudsRef} />

      {/* Sphere 3: Atmosphere (scale 1.02x, radius = 2.04) */}
      <Atmosphere radius={2.04} />

      {/* Orbit Rings & Particles */}
      <OrbitRings ringsRef={ringsRef} />
    </group>
  );
}

export function EarthScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[480px] md:min-h-[620px] select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 35 }} // FOV 35 so Earth fills ~70% of container
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        className="w-full h-full bg-[#000000]"
      >
        <color attach="background" args={[EARTH_COLORS.background]} />

        {/* Lighting: AmbientLight 0.15 + DirectionalLight 2.0 at (5, 3, 5) */}
        <ambientLight intensity={0.15} />
        <directionalLight
          position={[5, 3, 5]}
          intensity={2.0}
          color="#ffffff"
        />

        <CameraRig />

        <Suspense fallback={null}>
          <GlobeContent />
          <Stars count={2000} />
          <Particles count={180} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
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
