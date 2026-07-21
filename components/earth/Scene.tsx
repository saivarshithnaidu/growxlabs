'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeepSpaceStars } from './Stars';
import { ShootingStars } from './ShootingStars';

function DeepSpaceCameraRig() {
  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();
    // Ultra-subtle floating movement (5-10px max drift for Interstellar/Apple Vision Pro feel)
    camera.position.x = Math.sin(time * 0.12) * 0.15;
    camera.position.y = Math.cos(time * 0.09) * 0.12;
    camera.lookAt(0, 0, -50);
  });
  return null;
}

export function DeepSpaceScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] select-none bg-[#000000]"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
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
        <color attach="background" args={['#000000']} />

        <DeepSpaceCameraRig />

        <Suspense fallback={null}>
          <DeepSpaceStars count={35000} />
          <ShootingStars />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default DeepSpaceScene;
