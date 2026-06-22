import * as THREE from 'three'
import { clamp } from '../utils/MathUtils'

export class WebSlinger {
  private scene: THREE.Scene
  private isSwinging: boolean = false
  private anchorPoint: THREE.Vector3 = 
    new THREE.Vector3()
  private pendulumLength: number = 0
  private angularVelocity: number = 0
  private webLine: THREE.Line | null = null
  private collidables: THREE.Mesh[] = []
  private raycaster = new THREE.Raycaster()
  private swingVelocity: THREE.Vector3 = 
    new THREE.Vector3()
  private hasValidAnchor: boolean = false

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  setCollidables(meshes: THREE.Mesh[]): void {
    this.collidables = meshes
  }

  checkAnchor(
    position: THREE.Vector3,
    forwardDir: THREE.Vector3
  ): boolean {
    const shootDir = new THREE.Vector3(
      forwardDir.x * 0.6,
      0.8,
      forwardDir.z * 0.6
    ).normalize()

    this.raycaster.set(position, shootDir)
    this.raycaster.far = 80

    const hits = this.raycaster
      .intersectObjects(this.collidables, false)

    if (hits.length > 0) {
      this.anchorPoint.copy(hits[0].point)
      this.hasValidAnchor = true
      return true
    }
    this.hasValidAnchor = false
    return false
  }

  startSwing(position: THREE.Vector3): void {
    if (!this.hasValidAnchor) return
    this.isSwinging = true
    this.pendulumLength = position
      .distanceTo(this.anchorPoint)
    this.pendulumLength = Math.max(
      this.pendulumLength, 15)
    this.angularVelocity = 0.1
    this.createWebLine()
  }

  update(
    delta: number,
    position: THREE.Vector3
  ): THREE.Vector3 | null {
    if (!this.isSwinging) return null

    const toAnchor = this.anchorPoint
      .clone().sub(position)
    const dist = toAnchor.length()

    const gravity = 25
    const angle = Math.asin(
      clamp(toAnchor.x / dist, -1, 1))
    const angularAccel = -(gravity / 
      this.pendulumLength) * Math.sin(angle)

    this.angularVelocity += angularAccel * delta
    this.angularVelocity = clamp(
      this.angularVelocity, -3, 3)

    const tangent = new THREE.Vector3(
      Math.cos(angle),
      0,
      toAnchor.z / dist
    ).normalize()

    const speed = clamp(
      Math.abs(this.angularVelocity) * 
      this.pendulumLength,
      8, 45
    )

    this.swingVelocity = tangent
      .multiplyScalar(
        this.angularVelocity > 0 ? speed : -speed)
    this.swingVelocity.y = 
      this.angularVelocity * 5

    // Update web line
    if (this.webLine) {
      const positions = this.webLine.geometry
        .attributes.position
      positions.setXYZ(0, 
        position.x, position.y + 2, position.z)
      positions.setXYZ(1,
        this.anchorPoint.x,
        this.anchorPoint.y,
        this.anchorPoint.z
      )
      positions.needsUpdate = true
    }

    return this.swingVelocity.clone()
      .multiplyScalar(delta)

  }

  stopSwing(): THREE.Vector3 {
    this.isSwinging = false
    this.removeWebLine()
    return this.swingVelocity.clone()
      .multiplyScalar(1.3)
  }

  private createWebLine(): void {
    this.removeWebLine()
    const points = [
      new THREE.Vector3(),
      this.anchorPoint.clone()
    ]
    const geo = new THREE.BufferGeometry()
      .setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      linewidth: 2
    })
    this.webLine = new THREE.Line(geo, mat)
    this.scene.add(this.webLine)
  }

  private removeWebLine(): void {
    if (this.webLine) {
      this.scene.remove(this.webLine)
      this.webLine.geometry.dispose()
      this.webLine = null
    }
  }

  getIsSwinging(): boolean {
    return this.isSwinging
  }

  getHasValidAnchor(): boolean {
    return this.hasValidAnchor
  }

  getAnchorPoint(): THREE.Vector3 {
    return this.anchorPoint
  }
}
