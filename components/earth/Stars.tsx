'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom GLSL Shaders for 100% Perfect Circular Star Discs with Soft Radial Falloff
const StarVertexShader = `
  attribute float aSize;
  attribute float aTwinkle;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vSize;
  varying float vTwinkle;

  void main() {
    vColor = aColor;
    vSize = aSize;
    vTwinkle = aTwinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Attenuate size smoothly based on distance from camera
    gl_PointSize = aSize * (260.0 / -mvPosition.z);
  }
`;

const StarFragmentShader = `
  uniform float uTime;

  varying vec3 vColor;
  varying float vSize;
  varying float vTwinkle;

  void main() {
    // Calculate distance from center of point sprite (0.5, 0.5)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    // Discard any fragments outside the circle boundary (GUARANTEES ZERO SQUARES)
    if (dist > 0.5) {
      discard;
    }

    // Soft Gaussian radial glow falloff: bright center -> smooth transparent edge
    float alpha = exp(-dist * dist * 22.0);

    // Gentle organic twinkle for ~8% of stars
    float twinkle = 1.0;
    if (vTwinkle > 0.92) {
      twinkle = 0.72 + 0.28 * sin(uTime * 2.2 + vSize * 12.0);
    }

    vec3 finalColor = vColor * twinkle;
    gl_FragColor = vec4(finalColor, alpha * 0.95);
  }
`;

interface LayerConfig {
  count: number;
  minSize: number;
  maxSize: number;
  speed: number;
  spreadX: number;
  spreadY: number;
  spreadZ: number;
}

function StarFieldLayer({ count, minSize, maxSize, speed, spreadX, spreadY, spreadZ }: LayerConfig) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, colors, sizes, twinkles } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const twk = new Float32Array(count);

    // Color Palette: 95% Pure White, 3% Soft Blue, 1% Warm Gold, 1% Soft Cyan
    const colorWhite = new THREE.Color('#ffffff');
    const colorBlue = new THREE.Color('#a5f3fc');
    const colorGold = new THREE.Color('#fef08a');
    const colorCyan = new THREE.Color('#60a5fa');

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = -Math.random() * spreadZ + 15;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color selection
      const randColor = Math.random();
      let selectedColor = colorWhite;
      if (randColor > 0.99) selectedColor = colorCyan;
      else if (randColor > 0.98) selectedColor = colorGold;
      else if (randColor > 0.95) selectedColor = colorBlue;

      // Realistic magnitude/brightness variation mimicking actual stellar luminosity
      const brightness = 0.38 + 0.62 * Math.random();
      col[i * 3] = selectedColor.r * brightness;
      col[i * 3 + 1] = selectedColor.g * brightness;
      col[i * 3 + 2] = selectedColor.b * brightness;

      sz[i] = Math.random() * (maxSize - minSize) + minSize;
      twk[i] = Math.random(); // Used in shader for 5-10% gentle twinkle selection
    }

    return { positions: pos, colors: col, sizes: sz, twinkles: twk };
  }, [count, minSize, maxSize, spreadX, spreadY, spreadZ]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }

    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
      const array = positionAttr.array as Float32Array;

      const deltaFactor = Math.min(delta, 0.1) * 60; // 60 FPS normalization

      for (let i = 0; i < count; i++) {
        let z = array[i * 3 + 2];
        z += speed * deltaFactor;

        // When star passes camera (+15), recycle far away (-spreadZ + 15)
        if (z > 15) {
          z = -spreadZ + 15;
          array[i * 3] = (Math.random() - 0.5) * spreadX;
          array[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
        }

        array[i * 3 + 2] = z;
      }

      positionAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aTwinkle" args={[twinkles, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={StarVertexShader}
        fragmentShader={StarFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function DeepSpaceStars() {
  return (
    <group>
      {/* Layer 1: 25,000 tiny distant background stars (0.3px–0.8px, slow speed) */}
      <StarFieldLayer
        count={25000}
        minSize={0.35}
        maxSize={0.85}
        speed={0.035}
        spreadX={360}
        spreadY={360}
        spreadZ={420}
      />

      {/* Layer 2: 5,000 medium stars (1.0px–2.0px, medium speed, subtle twinkle) */}
      <StarFieldLayer
        count={5000}
        minSize={0.9}
        maxSize={1.9}
        speed={0.09}
        spreadX={280}
        spreadY={280}
        spreadZ={340}
      />

      {/* Layer 3: 300 larger foreground glowing stars (2.0px–4.0px, faster parallax) */}
      <StarFieldLayer
        count={300}
        minSize={2.0}
        maxSize={3.8}
        speed={0.20}
        spreadX={180}
        spreadY={180}
        spreadZ={250}
      />
    </group>
  );
}

export const Stars = DeepSpaceStars;
