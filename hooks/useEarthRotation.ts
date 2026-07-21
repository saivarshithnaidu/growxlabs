import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UseEarthRotationOptions {
  baseSpeed?: number; // Radians per frame (~150 seconds per full turn)
  cloudSpeedMultiplier?: number;
}

export function useEarthRotation({
  baseSpeed = (Math.PI * 2) / (150 * 60), // 150 seconds per rotation at 60 FPS
  cloudSpeedMultiplier = 1.25,
}: UseEarthRotationOptions = {}) {
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Smooth interpolation values
  const currentSpeedRef = useRef(baseSpeed);

  useFrame((_, delta) => {
    if (!earthGroupRef.current) return;

    // Adjust target speed based on hover or drag
    let targetSpeed = baseSpeed;
    if (isDragging) {
      targetSpeed = 0; // Manual control takes over
    } else if (isHovered) {
      targetSpeed = baseSpeed * 0.35; // Slow down on hover for precision look
    }

    // Lerp rotation speed for smooth transitions
    currentSpeedRef.current = THREE.MathUtils.lerp(
      currentSpeedRef.current,
      targetSpeed,
      0.05
    );

    // Apply linear rotation around Y-axis
    earthGroupRef.current.rotation.y += currentSpeedRef.current;

    // Rotate cloud layer slightly faster
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += currentSpeedRef.current * cloudSpeedMultiplier;
    }

    // Rotate orbit rings very slowly
    if (ringsRef.current) {
      ringsRef.current.rotation.y += currentSpeedRef.current * 0.5;
    }
  });

  const handlePointerOver = useCallback(() => setIsHovered(true), []);
  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
    setIsDragging(false);
  }, []);
  const handlePointerDown = useCallback(() => setIsDragging(true), []);
  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  return {
    earthGroupRef,
    cloudsRef,
    ringsRef,
    isHovered,
    isDragging,
    bindInteractions: {
      onPointerOver: handlePointerOver,
      onPointerOut: handlePointerOut,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    },
  };
}
