import * as THREE from 'three'
import { clamp } from '../utils/MathUtils'

export class CameraController {
  private camera: THREE.PerspectiveCamera
  private yaw: number = 0
  private pitch: number = -0.2
  private targetPosition: THREE.Vector3 = 
    new THREE.Vector3()
  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
  }

  update(
    delta: number,
    playerPos: THREE.Vector3,
    cameraDelta: THREE.Vector2,
    isSwinging: boolean,
    isWallRunning: boolean,
    velocity: THREE.Vector3
  ): void {

    // Rotate camera
    this.yaw -= cameraDelta.x
    this.pitch -= cameraDelta.y
    this.pitch = clamp(
      this.pitch, -0.8, 0.5)

    // Camera distance and FOV
    const distance = isSwinging ? 12 : 8
    const targetFOV = isSwinging ? 95 : 75
    this.camera.fov += 
      (targetFOV - this.camera.fov) * delta * 3
    this.camera.updateProjectionMatrix()

    // Camera position
    const offset = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch) + 0.5,
      Math.cos(this.yaw) * Math.cos(this.pitch)
    ).multiplyScalar(-distance)

    this.targetPosition.copy(
      playerPos).add(offset)
    this.camera.position.lerp(
      this.targetPosition, delta * 6)

    // Look at player
    const lookTarget = playerPos.clone()
    lookTarget.y += 2
    this.camera.lookAt(lookTarget)

    // Swing camera tilt
    const targetRoll = isSwinging 
      ? velocity.x * 0.015 : 0
    this.camera.rotation.z += 
      (targetRoll - this.camera.rotation.z) * 
      delta * 3

    // Wall run tilt
    if (isWallRunning) {
      this.camera.rotation.z = 
        clamp(this.camera.rotation.z + 0.3, 
              -0.4, 0.4)
    }
  }

  getYaw(): number { return this.yaw }

  getForwardDir(): THREE.Vector3 {
    return new THREE.Vector3(
      Math.sin(this.yaw), 0, Math.cos(this.yaw)
    ).negate()
  }
}
