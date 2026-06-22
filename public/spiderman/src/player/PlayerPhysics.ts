import * as THREE from 'three'
import { clamp } from '../utils/MathUtils'

export type PlayerState = 
  'GROUNDED' | 'JUMPING' | 
  'FALLING' | 'WALL_RUNNING' | 'WALL_CRAWLING' | 'SWINGING' | 'DIVE'

export class PlayerPhysics {
  position: THREE.Vector3 = new THREE.Vector3(0, 15, 60)
  velocity: THREE.Vector3 = new THREE.Vector3()
  state: PlayerState = 'FALLING'
  facingAngle: number = 0

  heroType: 'SPIDERMAN' | 'HULK' = 'SPIDERMAN'
  onGroundSmash: ((velocityFactor: number) => void) | null = null

  // 3D Rope Constraint fields
  anchorPoint = new THREE.Vector3()
  ropeLength = 0
  isSwinging = false

  // Wall crawling properties
  wallNormal = new THREE.Vector3()
  private wallRunTimer = 0
  private readonly MAX_WALL_RUN_TIME = 2.0

  private readonly GRAVITY = 26
  private readonly MAX_FALL = 65
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
    _isSwingingArg: boolean // Obsolete: we use class property isSwinging
  ): void {
    if (this.isSwinging) {
      this.updateSwinging(delta, moveDir)
      return
    }

    if (this.state === 'WALL_CRAWLING') {
      this.updateWallCrawling(delta, moveDir, jumping)
      return
    }

    if (this.state === 'WALL_RUNNING') {
      this.updateWallRunning(delta, moveDir, jumping)
      return
    }

    if (this.state === 'DIVE') {
      this.updateDive(delta, moveDir)
      return
    }

    // Normal running & falling physics
    const moveSpeed = this.heroType === 'SPIDERMAN' ? 17 : 12
    const sprintSpeed = this.heroType === 'SPIDERMAN' ? 24 : 30
    const jumpForce = this.heroType === 'SPIDERMAN' ? 24 : 38

    const speed = sprinting ? sprintSpeed : moveSpeed

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
      const air = this.state !== 'GROUNDED' ? 0.45 : 1.0
      this.velocity.x = moveDir.x * speed * air
      this.velocity.z = moveDir.z * speed * air
      this.facingAngle = Math.atan2(moveDir.x, moveDir.z)
    } else {
      const decel = this.state === 'GROUNDED' ? 1 - delta * 12 : 1 - delta * 3.5
      this.velocity.x *= decel
      this.velocity.z *= decel
    }

    // Jump trigger
    if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
      this.velocity.y = jumpForce
      this.state = 'JUMPING'
      this.coyoteTime = 0
      this.jumpBuffer = 0
    }

    // Apply gravity
    if (this.state !== 'GROUNDED') {
      this.velocity.y -= this.GRAVITY * delta
      this.velocity.y = clamp(this.velocity.y, -this.MAX_FALL, 999)
    }

    // Move player
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
    this.position.z += this.velocity.z * delta

    // Floor and Building Collisions
    this.checkGround()
    this.checkBuildingCollision()
    this.checkWallAttach()

    // Grid Boundaries
    this.position.x = clamp(this.position.x, -500, 500)
    this.position.z = clamp(this.position.z, -500, 500)
  }

  private updateSwinging(delta: number, moveDir: THREE.Vector3): void {
    this.state = 'SWINGING'

    // 1. Gravity pulls player down
    this.velocity.y -= this.GRAVITY * delta

    // 2. Lateral steering inputs (steering forces momentum)
    if (moveDir.length() > 0) {
      const steerForce = moveDir.clone().multiplyScalar(42 * delta)
      this.velocity.add(steerForce)
    }

    // 3. Subtle drag to maintain stable energy loops
    this.velocity.multiplyScalar(1 - delta * 0.12)

    // Apply velocity
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
    this.position.z += this.velocity.z * delta

    // 4. Solve Rope Distance Constraint (Tension)
    const toAnchor = this.anchorPoint.clone().sub(this.position)
    const currentDist = toAnchor.length()

    if (currentDist >= this.ropeLength) {
      const normal = toAnchor.clone().normalize()
      
      // Pull player in to keep rope length exact
      this.position.copy(this.anchorPoint).sub(normal.clone().multiplyScalar(this.ropeLength))

      // Radial velocity project: remove the velocity component pulling away from the anchor
      const radialVel = this.velocity.dot(normal)
      if (radialVel < 0) {
        this.velocity.sub(normal.clone().multiplyScalar(radialVel))
      }
    }

    // Keep swing within street level bounds
    if (this.position.y < 1.2) {
      this.position.y = 1.2
      this.velocity.y = 0
    }
    
    // Check building collisions while swinging
    this.checkBuildingCollision()
  }

  private checkWallAttach(): void {
    if (this.heroType !== 'SPIDERMAN') return
    if (this.state === 'GROUNDED' || this.state === 'SWINGING') return

    // Cast ray in the direction of velocity (or facing direction) to stick to walls
    const checkDir = new THREE.Vector3(
      Math.sin(this.facingAngle),
      0,
      Math.cos(this.facingAngle)
    ).normalize()

    this.raycaster.set(this.position, checkDir)
    this.raycaster.far = 1.3

    const hits = this.raycaster.intersectObjects(this.collidables, false)
    if (hits.length > 0 && hits[0].distance < 1.3) {
      this.wallNormal.copy(hits[0].face!.normal)
      const horizontalSpeed = new THREE.Vector3(this.velocity.x, 0, this.velocity.z).length()
      
      if (horizontalSpeed > 10.0 || this.state === 'DIVE') {
        this.state = 'WALL_RUNNING'
        this.wallRunTimer = this.MAX_WALL_RUN_TIME
      } else {
        this.state = 'WALL_CRAWLING'
        this.velocity.set(0, 0, 0)
      }
    }
  }

  private updateWallCrawling(delta: number, moveDir: THREE.Vector3, jumping: boolean): void {
    // Face the wall (normal is pointing OUT of the wall, so face -Normal)
    this.facingAngle = Math.atan2(-this.wallNormal.x, -this.wallNormal.z)

    // Calculate vertical and horizontal movement vectors along the wall surface
    // Wall Normal N, horizontal tangent T = N x Y
    const normal = this.wallNormal.clone()
    const verticalAxis = new THREE.Vector3(0, 1, 0)
    const tangent = normal.clone().cross(verticalAxis).normalize()

    // Determine movement speed along wall
    const crawlSpeed = 7.0
    const moveVel = new THREE.Vector3()

    if (moveDir.length() > 0) {
      // Horizontal crawl along tangent
      const hProjection = moveDir.dot(tangent)
      moveVel.add(tangent.clone().multiplyScalar(hProjection * crawlSpeed))

      // Vertical crawl along Y
      // We check if joystick is pointing forward (climbing up) or backward (climbing down)
      const vProjection = moveDir.y !== 0 ? moveDir.y : (moveDir.z < 0 ? 1 : (moveDir.z > 0 ? -1 : 0))
      moveVel.add(verticalAxis.clone().multiplyScalar(vProjection * crawlSpeed))
    }

    this.velocity.copy(moveVel)
    this.position.add(this.velocity.clone().multiplyScalar(delta))

    // Keep crawling aligned to wall depth
    this.raycaster.set(this.position, normal.clone().negate())
    this.raycaster.far = 1.6
    const wallCheck = this.raycaster.intersectObjects(this.collidables, false)
    if (wallCheck.length > 0) {
      const dist = wallCheck[0].distance
      // Push/pull player to maintain exactly 1.1 units away from building wall
      this.position.add(normal.clone().multiplyScalar(dist - 1.1))
    } else {
      // Lost contact with wall, fall
      this.state = 'FALLING'
      return
    }

    // Jump off wall
    if (jumping) {
      this.velocity.copy(normal.clone().multiplyScalar(15).add(new THREE.Vector3(0, 12, 0)))
      this.state = 'JUMPING'
      return
    }

    // Ledge-climb over the top checks!
    // Cast a ray forward at chest level (pos.y + 0.6) and feet level (pos.y - 0.6)
    const chestCheck = new THREE.Raycaster(
      this.position.clone().add(new THREE.Vector3(0, 0.6, 0)),
      normal.clone().negate(),
      0.1,
      1.8
    ).intersectObjects(this.collidables, false)

    const feetCheck = new THREE.Raycaster(
      this.position.clone().add(new THREE.Vector3(0, -0.6, 0)),
      normal.clone().negate(),
      0.1,
      1.8
    ).intersectObjects(this.collidables, false)

    // If feet touch wall but chest doesn't, we have hit the top ledge!
    if (feetCheck.length > 0 && chestCheck.length === 0) {
      // Climb over the ledge onto the roof!
      this.position.add(normal.clone().negate().multiplyScalar(1.5)) // step forward
      this.position.y += 1.2 // step up
      this.velocity.set(0, 0, 0)
      this.state = 'GROUNDED'
    }

    // Touch the floor
    if (this.position.y <= 1.1) {
      this.position.y = 1.1
      this.velocity.set(0, 0, 0)
      this.state = 'GROUNDED'
    }
  }

  releaseSwing(forwardDir: THREE.Vector3): void {
    this.isSwinging = false
    
    // Slingshot forward release boost (Spider-Man PS4 style)
    const speedFactor = Math.max(this.velocity.length(), 22)
    this.velocity.copy(forwardDir).multiplyScalar(speedFactor + 10)
    
    // Add upward vertical slingshot velocity
    this.velocity.y = Math.max(this.velocity.y + 11, 14)
    this.state = 'JUMPING'
  }

  private checkGround(): void {
    this.raycaster.set(
      this.position,
      new THREE.Vector3(0, -1, 0)
    )
    this.raycaster.far = 2.5
    
    const hits = this.raycaster.intersectObjects(this.collidables, false)

    const prevYVel = this.velocity.y
    let landed = false

    // Avoid landing snapping while moving upwards (jumping phase)
    const isMovingUp = this.velocity.y > 0.1
    // Ground snapping threshold is tighter when already grounded (to allow stepping off ledges to fall)
    // and slightly larger when landing from the air to catch fast-falling players.
    const snapThreshold = this.state === 'GROUNDED' ? 1.3 : 2.0

    if (this.position.y <= 1.1) {
      this.position.y = 1.1
      this.velocity.y = 0
      if (this.state !== 'GROUNDED' && this.state !== 'WALL_CRAWLING') landed = true
      this.state = 'GROUNDED'
    } else if (!isMovingUp && hits.length > 0 && hits[0].distance < snapThreshold) {
      this.position.y = hits[0].point.y + 1.1
      this.velocity.y = 0
      if (this.state !== 'GROUNDED' && this.state !== 'WALL_CRAWLING') landed = true
      this.state = 'GROUNDED'
    } else if (this.state === 'GROUNDED') {
      this.state = 'FALLING'
    }

    if (landed && prevYVel < -12) {
      this.onGroundSmash?.(Math.abs(prevYVel))
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
      this.raycaster.far = 1.2
      const hits = this.raycaster.intersectObjects(this.collidables, false)
      if (hits.length > 0 && hits[0].distance < 1.2) {
        const push = dir.clone().multiplyScalar(-(1.2 - hits[0].distance))
        this.position.add(push)
        if (dir.x !== 0) this.velocity.x = 0
        if (dir.z !== 0) this.velocity.z = 0
      }
    })
  }

  applySwingVelocity(vel: THREE.Vector3): void {
    this.velocity.copy(vel)
  }

  private updateWallRunning(delta: number, moveDir: THREE.Vector3, jumping: boolean): void {
    this.wallRunTimer -= delta
    
    const normal = this.wallNormal.clone()
    const verticalAxis = new THREE.Vector3(0, 1, 0)
    const tangent = normal.clone().cross(verticalAxis).normalize()

    const speed = 25.0
    const velocityProjection = new THREE.Vector3()

    if (moveDir.length() > 0) {
      const hProj = moveDir.dot(tangent)
      velocityProjection.add(tangent.clone().multiplyScalar(hProj * speed))

      const vProj = moveDir.y !== 0 ? moveDir.y : (moveDir.z < 0 ? 1 : 0)
      if (vProj > 0) {
        const climbDecay = Math.max(this.wallRunTimer / this.MAX_WALL_RUN_TIME, 0.2)
        velocityProjection.add(verticalAxis.clone().multiplyScalar(vProj * speed * climbDecay))
      }
    } else {
      velocityProjection.add(verticalAxis.clone().multiplyScalar(-3.0))
    }

    this.velocity.copy(velocityProjection)
    this.position.add(this.velocity.clone().multiplyScalar(delta))

    if (this.velocity.length() > 1.0) {
      this.facingAngle = Math.atan2(this.velocity.x, this.velocity.z)
    }

    this.raycaster.set(this.position, normal.clone().negate())
    this.raycaster.far = 1.6
    const wallCheck = this.raycaster.intersectObjects(this.collidables, false)
    if (wallCheck.length > 0) {
      const dist = wallCheck[0].distance
      this.position.add(normal.clone().multiplyScalar(dist - 1.1))
    } else {
      this.state = 'FALLING'
      return
    }

    if (this.wallRunTimer <= 0) {
      this.state = 'FALLING'
      return
    }

    if (jumping) {
      this.velocity.copy(normal.clone().multiplyScalar(16).add(new THREE.Vector3(0, 16, 0)))
      this.state = 'JUMPING'
      return
    }

    const chestCheck = new THREE.Raycaster(
      this.position.clone().add(new THREE.Vector3(0, 0.6, 0)),
      normal.clone().negate(),
      0.1,
      1.8
    ).intersectObjects(this.collidables, false)

    const feetCheck = new THREE.Raycaster(
      this.position.clone().add(new THREE.Vector3(0, -0.6, 0)),
      normal.clone().negate(),
      0.1,
      1.8
    ).intersectObjects(this.collidables, false)

    if (feetCheck.length > 0 && chestCheck.length === 0) {
      this.position.add(normal.clone().negate().multiplyScalar(1.5))
      this.position.y += 1.2
      this.velocity.set(0, 0, 0)
      this.state = 'GROUNDED'
    }

    if (this.position.y <= 1.1) {
      this.position.y = 1.1
      this.velocity.set(0, 0, 0)
      this.state = 'GROUNDED'
    }
  }

  private updateDive(delta: number, moveDir: THREE.Vector3): void {
    this.velocity.y -= this.GRAVITY * 2.2 * delta
    this.velocity.y = Math.max(this.velocity.y, -75)

    const glideSpeed = this.heroType === 'SPIDERMAN' ? 22 : 15
    if (moveDir.length() > 0) {
      this.velocity.x = moveDir.x * glideSpeed
      this.velocity.z = moveDir.z * glideSpeed
      this.facingAngle = Math.atan2(moveDir.x, moveDir.z)
    }

    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
    this.position.z += this.velocity.z * delta

    this.checkGround()
    this.checkBuildingCollision()
  }

  getState(): PlayerState { return this.state }
}
