# Production-Grade 3D Interactive Earth Hero Section

A GPU-accelerated, highly realistic interactive 3D Earth component built for **GrowXLabs** using **Next.js 15 (App Router), React 19, TypeScript, Three.js, React Three Fiber (`@react-three/fiber`), and `@react-three/drei`**.

Designed with an aesthetic inspired by Apple, OpenAI, Stripe, and Linear—minimal, elegant, and cinematic.

---

## 🏗️ Architecture & Component Hierarchy

```
Camera (Perspective, floating rig)
  │
  ├── Earth (Sphere + Custom Day/Night & Specular Shader)
  ├── Atmosphere (GLSL Fresnel scattering rim)
  ├── Clouds (Semi-transparent cloud mesh)
  ├── Stars (Pure white background starfield)
  ├── OrbitRings (Thin cyan concentric orbit paths)
  └── Particles (Floating space particles)
```

### Files Directory
- `/lib/three.ts`: Custom GLSL shaders (`EarthShader`, `AtmosphereShader`), color palettes, disposal utilities, and procedural canvas texture generators.
- `/hooks/useEarthRotation.ts`: Custom React hook driving infinite linear Y-axis rotation, differential cloud rotation, and smooth mouse drag/hover state dampening.
- `/components/earth/Earth.tsx`: 3D Earth sphere with anisotropy-filtered textures and custom ShaderMaterial.
- `/components/earth/Atmosphere.tsx`: Thin atmospheric scattering rim using GLSL Fresnel shader.
- `/components/earth/Clouds.tsx`: Cloud layer mesh with opacity blending.
- `/components/earth/Stars.tsx`: Subtle white background stars (no galaxy wallpapers).
- `/components/earth/OrbitRings.tsx`: Thin cyan orbit rings with opacity < 10%.
- `/components/earth/Particles.tsx`: Small white and cyan floating particles.
- `/components/earth/Scene.tsx`: Main R3F Canvas wrapper with lighting, CameraRig, OrbitControls (`enableZoom={false}`, `enablePan={false}`), and Suspense fallback.
- `/public/textures/`: Texture map assets (`earth_daymap.jpg`, `earth_nightlights.jpg`, `earth_clouds.jpg`, `earth_normal.png`, `earth_specular.png`).

---

## 🎨 Color Palette

| Element | Color | Code / Hex |
| :--- | :--- | :--- |
| **Background** | Pure Black | `#050505` |
| **Atmosphere** | Cyan | `#53D9FF` |
| **Orbit Rings** | Thin Cyan | `rgba(83, 217, 255, 0.08)` |
| **Stars** | Pure White | `#FFFFFF` |
| **City Lights** | Warm White | `#FFE5B4` |

---

## ⚡ Performance Optimizations

1. **Lazy Loading & Tree Shaking**: Loaded asynchronously via `next/dynamic` (`ssr: false`) to eliminate SSR hydration costs and keep main bundle light.
2. **Anisotropy & Linear Mipmapping**: Texture filtering optimized for crisp rendering on high-DPI displays without GPU memory strain.
3. **WebGL Resource Cleanup**: `disposeObject()` utilities in `/lib/three.ts` clean up geometries and materials on unmount to prevent WebGL context leaks.
4. **Target Framerates**: 60 FPS on desktop GPUs, 30+ FPS on mobile hardware.

---

## 🛠️ Setup & Usage

```tsx
import dynamic from 'next/dynamic';

const EarthScene = dynamic(() => import('@/components/earth/Scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#53D9FF]/30 border-t-[#53D9FF] rounded-full animate-spin" />
    </div>
  ),
});

export function Hero() {
  return (
    <div className="relative w-full h-[600px] bg-[#050505]">
      <EarthScene />
      <div className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2">
        {/* Prompt Box Overlay */}
      </div>
    </div>
  );
}
```
