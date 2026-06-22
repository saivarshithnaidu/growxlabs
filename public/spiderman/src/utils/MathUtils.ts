import * as THREE from 'three'

export function lerpV3(
  a: THREE.Vector3,
  b: THREE.Vector3,
  t: number
): THREE.Vector3 {
  return new THREE.Vector3(
    a.x + (b.x - a.x) * t,
    a.y + (b.y - a.y) * t,
    a.z + (b.z - a.z) * t
  )
}

export function clamp(
  val: number,
  min: number,
  max: number
): number {
  return Math.max(min, Math.min(max, val))
}

export function randomRange(
  min: number,
  max: number
): number {
  return Math.random() * (max - min) + min
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function createToonRamp(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 1
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#555555' // Dark shadow
  ctx.fillRect(0, 0, 1, 1)
  ctx.fillStyle = '#999999' // Midtone
  ctx.fillRect(1, 0, 2, 1)
  ctx.fillStyle = '#ffffff' // Highlight
  ctx.fillRect(3, 0, 1, 1)
  
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter
  tex.needsUpdate = true
  return tex
}
