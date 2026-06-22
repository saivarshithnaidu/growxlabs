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
