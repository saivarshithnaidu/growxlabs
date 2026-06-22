import * as THREE from 'three'
import { clamp } from '../utils/MathUtils'

export type PlayerState = 
  'GROUNDED' | 'JUMPING' | 
  'FALLING' | 'WALL_RUNNING' | 'SWINGING'

export class PlayerPhysics {
  position: THREE.Vector3 = 
    new THREE.Vector3(0, 2, 50)
  velocity: THREE.Vector3 = 
    new THREE.Vector3()
  state: PlayerState = 'FALLING'
  facingAngle: number = 0

  private readonly GRAVITY = 25
  private readonly MOVE_SPEED = 15
  private readonly SPRINT_SPEED = 22
  private readonly JUMP_FORCE = 25
  private readonly MAX_FALL = 60
  private coyoteTime: number = 0
  private jumpBuffer: number = 0
  private collidables: THREE.Mesh[] = []
  private raycaster = new THREE.Raycaster()

  setCollidables(meshes: THREE.Mesh[]): void {
    this.collidables = meshes
  }

  update(
    delta: number,
    moveDir: THREE.Vector3,
    jumping: boolean,
    sprinting: boolean,
    isSwinging: boolean
  ): void {
    if (isSwinging) return

    const speed = sprinting 
      ? this.SPRINT_SPEED 
      : this.MOVE_SPEED

    // Coyote time
    if (this.state === 'GROUNDED') {
      this.coyoteTime = 0.12
    } else {
      this.coyoteTime -= delta
    }

    // Jump buffer
    if (jumping) this.jumpBuffer = 0.1
    else this.jumpBuffer -= delta

    // Horizontal movement
    if (moveDir.length() > 0) {
      const air = this.state !== 'GROUNDED' 
        ? 0.3 : 1.0
      this.velocity.x = moveDir.x * speed * air
      this.velocity.z = moveDir.z * speed * air
      this.facingAngle = Math.atan2(
        moveDir.x, moveDir.z)
    } else {
      const decel = this.state === 'GROUNDED'
        ? 1 - delta * 12 : 1 - delta * 3
      this.velocity.x *= decel
      this.velocity.z *= decel
    }

    // Jump
    if (this.jumpBuffer > 0 && 
        this.coyoteTime > 0) {
      this.velocity.y = this.JUMP_FORCE
      this.state = 'JUMPING'
      this.coyoteTime = 0
      this.jumpBuffer = 0
    }

    // Gravity
    if (this.state !== 'GROUNDED') {
      this.velocity.y -= this.GRAVITY * delta
      this.velocity.y = clamp(
        this.velocity.y, -this.MAX_FALL, 999)
    }

    // Move
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
    this.position.z += this.velocity.z * delta

    // Ground check
    this.checkGround()

    // Building collision
    this.checkBuildingCollision()

    // Boundary
    this.position.x = clamp(
      this.position.x, -400, 400)
    this.position.z = clamp(
      this.position.z, -400, 400)
  }

  private checkGround(): void {
    this.raycaster.set(
      this.position,
      new THREE.Vector3(0, -1, 0)
    )
    const hits = this.raycaster.intersectObjects(
      this.collidables, false)

    if (this.position.y <= 1.1) {
      this.position.y = 1.1
      this.velocity.y = 0
      this.state = 'GROUNDED'
    } else if (hits.length > 0 && 
               hits[0].distance < 2.5) {
      this.position.y = 
        hits[0].point.y + 1.1
      this.velocity.y = 0
      this.state = 'GROUNDED'
    } else if (this.state === 'GROUNDED') {
      this.state = 'FALLING'
    }
  }

  private checkBuildingCollision(): void {
    const dirs = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1),
    ]
    dirs.forEach(dir => {
      this.raycaster.set(this.position, dir)
      const hits = this.raycaster
        .intersectObjects(this.collidables, false)
      if (hits.length > 0 && 
          hits[0].distance < 1.2) {
        const push = dir.clone().multiplyScalar(
          -(1.2 - hits[0].distance))
        this.position.add(push)
        if (dir.x !== 0) this.velocity.x = 0
        if (dir.z !== 0) this.velocity.z = 0
      }
    })
  }

  applySwingVelocity(vel: THREE.Vector3): void {
    this.velocity.copy(vel)
  }

  getState(): PlayerState { return this.state }
}
