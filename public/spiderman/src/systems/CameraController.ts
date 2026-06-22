import * as THREE from 'three'
import { clamp } from '../utils/MathUtils'

export class CameraController {
  private camera: THREE.PerspectiveCamera
  private yaw: number = 0
  private pitch: number = -0.2
  private roll: number = 0
  private targetPosition: THREE.Vector3 = 
    new THREE.Vector3()

  // Screen shake variables
  private shakeIntensity: number = 0
  private shakeDecay: number = 0

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    this.camera.rotation.order = 'YXZ'
  }

  update(
    delta: number,
    playerPos: THREE.Vector3,
    cameraDelta: THREE.Vector2,
    isSwinging: boolean,
    isWallRunning: boolean,
    velocity: THREE.Vector3,
    isWallCrawling: boolean = false
  ): void {

    // Rotate camera
    this.yaw -= cameraDelta.x
    this.pitch -= cameraDelta.y
    this.pitch = clamp(
      this.pitch, -0.8, 0.5)

    const speed = velocity.length()

    // Dynamic FOV based on speed (up to 115)
    let targetFOV = 75
    if (isWallCrawling) {
      targetFOV = 64 // Close cinematic crawling
    } else if (isSwinging) {
      const speedBonus = clamp((speed - 15) / 45, 0, 1) * 30
      targetFOV = 85 + speedBonus // 85 to 115
    } else {
      const speedBonus = clamp((speed - 10) / 35, 0, 1) * 20
      targetFOV = 75 + speedBonus // 75 to 95
    }
    
    this.camera.fov += (targetFOV - this.camera.fov) * delta * 4.5
    this.camera.updateProjectionMatrix()

    // Dynamic Camera Distance based on state & speed
    let distance = 8.5
    if (isWallCrawling) {
      distance = 5.2
    } else if (isSwinging) {
      distance = 13.5
    }

    if (!isWallCrawling) {
      const speedOffset = clamp((speed - 15) / 35, 0, 1) * 4.5
      distance += speedOffset
    }

    // Camera position offset
    const offset = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch) * -distance,
      (Math.sin(this.pitch) + (isWallCrawling ? 0.3 : 0.45)) * distance,
      Math.cos(this.yaw) * Math.cos(this.pitch) * -distance
    )

    this.targetPosition.copy(
      playerPos).add(offset)
    
    this.camera.position.lerp(
      this.targetPosition, delta * 7)

    // Apply Screen Shake if active
    if (this.shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity
      const sy = (Math.random() - 0.5) * this.shakeIntensity
      const sz = (Math.random() - 0.5) * this.shakeIntensity
      this.camera.position.add(new THREE.Vector3(sx, sy, sz))
      this.shakeIntensity -= this.shakeDecay * delta
    }

    // Camera lean/tilt (roll)
    let targetRoll = 0
    if (isSwinging) {
      targetRoll = clamp(velocity.x * 0.024, -0.32, 0.32)
    } else if (isWallRunning) {
      targetRoll = 0.25 // Smooth wall run tilt
    } else if (!isWallCrawling && speed > 15) {
      // Leaning into turns at high speed
      targetRoll = clamp(velocity.x * -0.012, -0.15, 0.15)
    }
    
    this.roll += (targetRoll - this.roll) * delta * 4

    // Point camera at look-ahead target
    const lookAheadOffset = velocity.clone().multiplyScalar(0.12)
    const lookAtTarget = playerPos.clone().add(lookAheadOffset)
    this.camera.lookAt(lookAtTarget)
    
    // Apply local roll/tilt
    if (this.roll !== 0) {
      this.camera.rotateZ(this.roll)
    }
  }

  // Trigger screen shake
  shake(intensity: number, duration: number): void {
    this.shakeIntensity = intensity
    this.shakeDecay = intensity / duration
  }

  getYaw(): number { return this.yaw }

  getForwardDir(): THREE.Vector3 {
    return new THREE.Vector3(
      Math.sin(this.yaw), 0, Math.cos(this.yaw)
    ).negate()
  }
}
