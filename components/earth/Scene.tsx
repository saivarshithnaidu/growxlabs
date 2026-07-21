'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Earth } from './Earth';
import { Stars } from './Stars';
import { useEarthRotation } from '@/hooks/useEarthRotation';
import { EARTH_COLORS } from '@/lib/three';

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();
    // Very subtle floating movement for camera
    camera.position.x = Math.sin(time * 0.08) * 0.04;
    camera.position.y = 0.2 + Math.cos(time * 0.1) * 0.03;
    camera.lookAt(0, -0.2, 0);
  });
  return null;
}

function GlobeContent() {
  const { earthGroupRef, bindInteractions } = useEarthRotation();

  return (
    <group ref={earthGroupRef} position={[0, -0.35, 0]} {...bindInteractions}>
      {/* Photorealistic NASA Blue Marble Earth */}
      <Earth radius={1.75} />
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
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        className="w-full h-full bg-[#050505]"
      >
        <color attach="background" args={[EARTH_COLORS.background]} />

        {/* Studio Front Key Light facing front camera + Ambient Fill Light */}
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[0, 4, 8]}
          intensity={2.8}
          color="#ffffff"
        />
        <directionalLight
          position={[-5, -2, -4]}
          intensity={0.4}
          color="#53D9FF"
        />

        <CameraRig />

        <Suspense fallback={null}>
          <GlobeContent />
          <Stars count={1000} />
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
