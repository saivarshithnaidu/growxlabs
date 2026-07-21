import * as THREE from 'three';

/**
 * Color Palette Constants
 */
export const EARTH_COLORS = {
  background: '#050505',
  atmosphere: '#53D9FF',
  orbitRing: 'rgba(83, 217, 255, 0.08)',
  stars: '#FFFFFF',
  cityLights: '#FFE5B4', // Warm White
};

/**
 * Atmosphere Custom Shader (Fresnel Atmospheric Scattering)
 */
export const AtmosphereShader = {
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vPosition;

    uniform vec3 color;
    uniform float coeficient;
    uniform float power;

    void main() {
      vec3 viewDirection = normalize(-vPosition);
      float intensity = pow(coeficient - dot(vNormal, viewDirection), power);
      intensity = clamp(intensity, 0.0, 1.0);
      gl_FragColor = vec4(color, intensity * 0.45);
    }
  `,
};

/**
 * Custom Day/Night Earth Shader with Night Lights Blending
 */
export const EarthShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vSunDirection;

    uniform vec3 sunPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vSunDirection = normalize(sunPosition - worldPosition.xyz);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vSunDirection;

    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D normalMap;
    uniform sampler2D specularMap;
    uniform vec3 atmosphereColor;

    void main() {
      vec3 dayColor = texture2D(dayTexture, vUv).rgb;
      vec3 nightColor = texture2D(nightTexture, vUv).rgb * vec3(1.2, 1.05, 0.85); // Warm white boost

      // Calculate lighting dot product
      float dProd = max(0.0, dot(vNormal, vSunDirection));

      // Smooth transition blend between day and night (terminator zone)
      float mixAmount = smoothstep(-0.25, 0.25, dot(vNormal, vSunDirection));

      // Day lighting with subtle atmospheric tint
      vec3 finalDay = dayColor * (dProd * 0.85 + 0.15);
      
      // Night lights active on unlit hemisphere
      vec3 finalNight = nightColor * (1.0 - mixAmount);

      vec3 finalColor = mix(finalNight, finalDay, mixAmount);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

/**
 * Safely dispose geometries and materials to avoid WebGL memory leaks
 */
export function disposeObject(object: THREE.Object3D): void {
  if (!object) return;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

function disposeMaterial(material: THREE.Material): void {
  material.dispose();
  Object.keys(material).forEach((key) => {
    const value = (material as unknown as Record<string, unknown>)[key];
    if (value && typeof value === 'object' && 'dispose' in value && typeof value.dispose === 'function') {
      value.dispose();
    }
  });
}

/**
 * Procedural texture generator fallbacks to ensure instant 60 FPS loading 
 * even before external texture assets finish loading.
 */
export function createProceduralEarthTextures(): {
  dayTexture: THREE.CanvasTexture;
  nightTexture: THREE.CanvasTexture;
  cloudsTexture: THREE.CanvasTexture;
  normalTexture: THREE.CanvasTexture;
  specularTexture: THREE.CanvasTexture;
} {
  const width = 2048;
  const height = 1024;

  // Day Texture
  const dayCanvas = document.createElement('canvas');
  dayCanvas.width = width;
  dayCanvas.height = height;
  const dayCtx = dayCanvas.getContext('2d')!;
  dayCtx.fillStyle = '#0a192f'; // Deep ocean blue
  dayCtx.fillRect(0, 0, width, height);

  // Continent shapes (Procedural realistic noise)
  dayCtx.fillStyle = '#1b3a2b'; // Deep land green
  for (let i = 0; i < 120; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = Math.random() * 180 + 40;
    dayCtx.beginPath();
    dayCtx.arc(cx, cy, r, 0, Math.PI * 2);
    dayCtx.fill();
  }

  // Night Lights Canvas
  const nightCanvas = document.createElement('canvas');
  nightCanvas.width = width;
  nightCanvas.height = height;
  const nightCtx = nightCanvas.getContext('2d')!;
  nightCtx.fillStyle = '#000000';
  nightCtx.fillRect(0, 0, width, height);
  nightCtx.fillStyle = '#ffe5b4'; // Warm white city lights

  for (let i = 0; i < 800; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 1.8 + 0.5;
    nightCtx.fillRect(x, y, size, size);
  }

  // Clouds Canvas
  const cloudsCanvas = document.createElement('canvas');
  cloudsCanvas.width = width;
  cloudsCanvas.height = height;
  const cloudsCtx = cloudsCanvas.getContext('2d')!;
  cloudsCtx.fillStyle = '#000000';
  cloudsCtx.fillRect(0, 0, width, height);
  cloudsCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';

  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = Math.random() * 140 + 30;
    cloudsCtx.beginPath();
    cloudsCtx.arc(cx, cy, r, 0, Math.PI * 2);
    cloudsCtx.fill();
  }

  // Normal Canvas
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const normalCtx = normalCanvas.getContext('2d')!;
  normalCtx.fillStyle = '#8080ff'; // Neutral normal blue
  normalCtx.fillRect(0, 0, width, height);

  // Specular Canvas
  const specCanvas = document.createElement('canvas');
  specCanvas.width = width;
  specCanvas.height = height;
  const specCtx = specCanvas.getContext('2d')!;
  specCtx.fillStyle = '#ffffff'; // Ocean high specular
  specCtx.fillRect(0, 0, width, height);

  return {
    dayTexture: new THREE.CanvasTexture(dayCanvas),
    nightTexture: new THREE.CanvasTexture(nightCanvas),
    cloudsTexture: new THREE.CanvasTexture(cloudsCanvas),
    normalTexture: new THREE.CanvasTexture(normalCanvas),
    specularTexture: new THREE.CanvasTexture(specCanvas),
  };
}
