"use client";

import * as THREE from "three";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";

/* ----------------------------- utilities ----------------------------- */

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as any).matches);

    setIsMobile(mq.matches);

    try {
      mq.addEventListener("change", onChange as any);
      return () => mq.removeEventListener("change", onChange as any);
    } catch {
      mq.addListener(onChange as any);
      return () => mq.removeListener(onChange as any);
    }
  }, [breakpoint]);

  return isMobile;
}

/* ----------------------------- shared shader ----------------------------- */

const vertexShader = `void main(){ gl_Position = vec4(position, 1.0); }`;

const fragmentShader = `
uniform float iTime;
uniform vec3 iResolution;
uniform float iMobile;

#define TAU 6.2831853071795865
#define SPEED 0.6

float sq(float x){ return x*x; }

vec2 AngRep(vec2 uv, float angle){
  float a = atan(uv.y, uv.x);
  float r = length(uv);
  a = mod(a + angle/2.0, angle) - angle/2.0;
  return r * vec2(cos(a), sin(a));
}

float sdCircle(vec2 uv, float r){ return length(uv) - r; }

vec2 TunnelPath(float x){
  return vec2(
    0.15 * sin(TAU * x * 0.4) + 0.3 * sin(TAU * x * 0.15),
    0.25 * cos(TAU * x * 0.2) + 0.15 * cos(TAU * x * 0.1)
  );
}

void main(){
  vec2 res = iResolution.xy / iResolution.y;
  vec2 uv = (gl_FragCoord.xy / iResolution.y) - res/2.0;
  vec3 color = vec3(0.0);
  
  // Ultra-optimized quality for mobile performance
  float layers = iMobile > 0.5 ? 32.0 : 72.0;
  float ringPoints = iMobile > 0.5 ? 48.0 : 96.0;
  float pointSizeBase = iMobile > 0.5 ? 3.0 : 1.8;
  
  float repAngle = TAU / ringPoints;
  float pointSize = pointSizeBase / (2.0 * iResolution.y);
  float camZ = iTime * SPEED;
  vec2 camOffs = TunnelPath(camZ);

  for(int i = 1; i <= 72; i++){
    if(float(i) > layers) break;
    
    float pz = 1.0 - (float(i) / layers);
    pz -= mod(camZ, 4.0 / layers);
    if(pz < 0.05) continue; // Skip very close layers

    vec2 offs = TunnelPath(camZ + pz) - camOffs;
    float ringRad = 0.18 * (1.0 / sq(pz * 0.8 + 0.4));
    
    // Performance optimization: bounding box check
    if(abs(length(uv + offs) - ringRad) < pointSize * 2.0){
      vec2 aruv = AngRep(uv + offs, repAngle);
      float pdist = sdCircle(aruv - vec2(ringRad, 0), pointSize);
      
      float shade = pow(1.0 - pz, 1.5);
      vec3 ptColor = (mod(float(i/2), 2.0) == 0.0) ? vec3(1.0) : vec3(0.6);
      
      float blend = smoothstep(1.0/iResolution.y, 0.0, pdist);
      color = mix(color, ptColor * shade, blend);
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

/* ----------------------------- three helpers ----------------------------- */

type ThreeContext = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
};

function createThreeForCanvas(canvas: HTMLCanvasElement, width: number, height: number): ThreeContext {
  const isMobile = width < 768;
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: false, // Disable AA for major performance gain
    alpha: true,
    powerPreference: "high-performance"
  });
  
  // Mobile performance target: lower resolution scaling
  const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(width, height, 1) },
      iMobile: { value: isMobile ? 1.0 : 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return { renderer, scene, camera, material, mesh, geometry };
}

function disposeThree(ctx: ThreeContext) {
  try {
    ctx.mesh.geometry.dispose();
    ctx.material.dispose();
    ctx.renderer.dispose();
  } catch (e) {}
}

/* ----------------------------- TunnelBackground ----------------------------- */

export function TunnelBackground() {
  const isMobile = useIsMobile(768);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<ThreeContext | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef<boolean>(false);

  const animate = useCallback((time: number) => {
    if (!ctxRef.current || pausedRef.current) {
      animRef.current = requestAnimationFrame(animate);
      return;
    }
    
    const timeInSec = time * 0.001;
    const delta = Math.min(timeInSec - (lastTimeRef.current || timeInSec), 0.1);
    lastTimeRef.current = timeInSec;
    
    ctxRef.current.material.uniforms.iTime.value += delta;
    ctxRef.current.renderer.render(ctxRef.current.scene, ctxRef.current.camera);
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const ctx = createThreeForCanvas(canvas, window.innerWidth, window.innerHeight);
    ctxRef.current = ctx;

    const handleResize = () => {
      if (!ctxRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMob = w < 768;
      ctxRef.current.renderer.setSize(w, h);
      ctxRef.current.material.uniforms.iResolution.value.set(w, h, 1);
      ctxRef.current.material.uniforms.iMobile.value = isMob ? 1.0 : 0.0;
    };

    window.addEventListener("resize", handleResize);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (ctxRef.current) disposeThree(ctxRef.current);
    };
  }, [animate, isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-40 bg-black"
    />
  );
}
