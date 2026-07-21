import * as THREE from 'three';

/**
 * NASA Earth Palette Constants
 */
export const EARTH_COLORS = {
  background: '#000000',
  atmosphere: '#40A0FF', // Soft Blue Fresnel Rim
  orbitRing: 'rgba(83, 217, 255, 0.08)',
  stars: '#FFFFFF',
};

/**
 * NASA Blue Marble Earth Shader
 * Blends daymap, night lights, specular ocean reflection, and normal map.
 */
export const NasaEarthShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vSunDirection;

    uniform vec3 sunPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vSunDirection = normalize(sunPosition - worldPos.xyz);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vSunDirection;

    uniform sampler2D dayMap;
    uniform sampler2D nightMap;
    uniform sampler2D normalMap;
    uniform sampler2D specularMap;
    uniform vec3 sunPosition;

    void main() {
      // 1. Sample Day Texture (Pure NASA Blue Marble colors - deep blue ocean, green forests, brown deserts, white ice)
      vec3 dayColor = texture2D(dayMap, vUv).rgb;

      // 2. Sample Night Lights Texture (Warm yellow city lights)
      vec3 nightColor = texture2D(nightMap, vUv).rgb * vec3(1.4, 1.2, 0.8);

      // 3. Sample Ocean Specular Mask (White oceans, Black land)
      float specularMask = texture2D(specularMap, vUv).r;

      // 4. Lighting Dot Product (Day vs Night hemisphere)
      vec3 normal = normalize(vNormal);
      vec3 sunDir = vSunDirection;
      float sunDot = dot(normal, sunDir);

      // Smooth Day/Night Terminator Blend
      float dayFactor = smoothstep(-0.15, 0.25, sunDot);

      // Day diffuse (Sun intensity)
      float diffuse = max(0.0, sunDot) * 0.85 + 0.15;
      vec3 dayLit = dayColor * diffuse;

      // Specular ocean reflection on day side
      vec3 viewDir = normalize(-vWorldPosition);
      vec3 reflectDir = reflect(-sunDir, normal);
      float spec = pow(max(0.0, dot(viewDir, reflectDir)), 32.0) * specularMask * 0.65;
      dayLit += vec3(spec);

      // Night side city lights (only visible on unlit night side)
      vec3 nightLit = nightColor * (1.0 - dayFactor) * 1.6;

      // Final day/night composition
      vec3 finalColor = mix(nightLit, dayLit, dayFactor);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

/**
 * Soft Blue Atmospheric Fresnel Scattering Shader (Sphere 2, 1.02x scale)
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
    uniform float coefficient;
    uniform float power;

    void main() {
      vec3 viewDirection = normalize(-vPosition);
      float intensity = pow(coefficient - dot(vNormal, viewDirection), power);
      intensity = clamp(intensity, 0.0, 1.0);
      gl_FragColor = vec4(color, intensity * 0.3); // Subtle soft blue atmosphere
    }
  `,
};

/**
 * WebGL Memory Disposal Utility
 */
export function disposeObject(object: THREE.Object3D): void {
  if (!object) return;
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}
