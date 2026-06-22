import * as THREE from 'three'

export class WebSlinger {
  private isSwinging: boolean = false
  private anchorPoint: THREE.Vector3 = new THREE.Vector3()
  private pendulumLength: number = 0
  private collidables: THREE.Mesh[] = []
  private raycaster = new THREE.Raycaster()
  private hasValidAnchor: boolean = false
  
  // Alternating wrist tracking
  private activeWristLeft: boolean = false

  constructor(_scene: THREE.Scene) {}

  setCollidables(meshes: THREE.Mesh[]): void {
    this.collidables = meshes
  }

  checkAnchor(
    position: THREE.Vector3,
    forwardDir: THREE.Vector3
  ): boolean {
    // Cast ray forward and slightly upward to find a ledge or building face
    const shootDir = new THREE.Vector3(
      forwardDir.x * 0.6,
      0.8,
      forwardDir.z * 0.6
    ).normalize()

    this.raycaster.set(position, shootDir)
    this.raycaster.far = 90 // Slightly longer range for tall buildings

    const hits = this.raycaster.intersectObjects(this.collidables, false)

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
    
    // Calculate length of the rope
    this.pendulumLength = position.distanceTo(this.anchorPoint)
    this.pendulumLength = Math.max(this.pendulumLength, 15)

    // Alternate which wrist shoots the web
    this.activeWristLeft = !this.activeWristLeft
  }

  stopSwing(): void {
    this.isSwinging = false
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

  getRopeLength(): number {
    return this.pendulumLength
  }

  getActiveWristIsLeft(): boolean {
    return this.activeWristLeft
  }
}
