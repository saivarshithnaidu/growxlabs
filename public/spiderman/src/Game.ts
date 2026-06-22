import * as THREE from 'three'
import { CityGenerator } from './world/CityGenerator'
import { StreetGenerator } from './world/StreetGenerator'
import { PropsGenerator } from './world/PropsGenerator'
import { PlayerPhysics } from './player/PlayerPhysics'
import { PlayerRenderer } from './player/PlayerRenderer'
import { WebSlinger } from './player/WebSlinger'
import { WallRunner } from './player/WallRunner'
import { InputHandler } from './systems/InputHandler'
import { CameraController } from './systems/CameraController'
import { CollectibleSystem } from './systems/CollectibleSystem'
import { AudioSystem } from './systems/AudioSystem'
import { GameHUD } from './ui/GameHUD'
import { VictoryScreen } from './ui/VictoryScreen'
import { randomRange } from './utils/MathUtils'

export class Game {
  private canvas: HTMLCanvasElement
  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private clock = new THREE.Clock()
  private animId: number = 0
  private isRunning = false
  private isGameOver = false

  private city!: CityGenerator
  private streets!: StreetGenerator
  private props!: PropsGenerator
  private physics!: PlayerPhysics
  private playerRenderer!: PlayerRenderer
  private webSlinger!: WebSlinger
  private wallRunner!: WallRunner
  private input!: InputHandler
  private cameraCtrl!: CameraController
  private collectibles!: CollectibleSystem
  private audio!: AudioSystem
  private hud!: GameHUD
  private victory!: VictoryScreen
  private clouds: THREE.Group[] = []

  // Start Screen & Transitions
  private gameState: 'TITLE' | 'TRANSITION' | 'PLAYING' = 'TITLE'
  private wasWebHeldLastFrame = false
  private airTime = 0
  private transitionTime: number = 0
  private transitionDuration: number = 2.2
  private transitionStartPos = new THREE.Vector3()
  private transitionStartQuat = new THREE.Quaternion()
  private introCameraTime: number = 0

  private titleGroup = new THREE.Group()
  private newspapers: THREE.Mesh[] = []
  private menuParticles: THREE.Mesh[] = []
  private titleBirds: THREE.Group[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.init()

    // Start render loop immediately for title screen animations
    this.isRunning = true
    this.clock.start()
    this.loop()
  }

  private init(): void {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.renderer.setSize(
      window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true

    // Scene
    this.scene = new THREE.Scene()
    
    // Sunset sky background linear gradient
    const skyCanvas = document.createElement('canvas')
    skyCanvas.width = 2
    skyCanvas.height = 512
    const skyCtx = skyCanvas.getContext('2d')!
    const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512)
    skyGrad.addColorStop(0, '#11052C') // Deep space purple top
    skyGrad.addColorStop(0.4, '#3E065F') // Dark magenta middle
    skyGrad.addColorStop(0.75, '#8E05C2') // Vibrant violet
    skyGrad.addColorStop(0.9, '#FF7A3B') // Sunset orange
    skyGrad.addColorStop(1, '#FFAE5D') // Warm golden horizon
    skyCtx.fillStyle = skyGrad
    skyCtx.fillRect(0, 0, 2, 512)
    const skyTex = new THREE.CanvasTexture(skyCanvas)
    this.scene.background = skyTex

    // Magenta Sunset Fog
    this.scene.fog = new THREE.FogExp2('#3E065F', 0.002)

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1, 1000
    )
    this.camera.position.set(0, 10, 20)

    // Lights
    const ambient = new THREE.AmbientLight(
      0x3E065F, 0.95) // Deep purple ambient fill
    this.scene.add(ambient)
    
    const sun = new THREE.DirectionalLight(
      0xFF7A3B, 2.0) // Strong orange sunset light
    sun.position.set(250, 70, -200) // Low sun angle
    sun.castShadow = true
    sun.shadow.mapSize.width = 2048
    sun.shadow.mapSize.height = 2048
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far = 600
    sun.shadow.camera.left = -200
    sun.shadow.camera.right = 200
    sun.shadow.camera.top = 200
    sun.shadow.camera.bottom = -200
    this.scene.add(sun)

    // World
    this.streets = new StreetGenerator(this.scene)
    this.streets.generate()
    this.props = new PropsGenerator(this.scene)
    this.props.generate()
    this.city = new CityGenerator(this.scene)
    this.city.generate()
    const collidables = this.city.getCollidables()
    
    this.createClouds()

    // Player
    this.physics = new PlayerPhysics()
    this.physics.setCollidables(collidables)
    this.physics.onGroundSmash = (vel) => {
      this.cameraCtrl.shake(vel * 0.15, 0.4)
      this.audio.playPlayerHit()
      this.createSmashParticles(this.physics.position)
    }
    this.playerRenderer = new PlayerRenderer(
      this.scene)
    this.webSlinger = new WebSlinger(this.scene)
    this.webSlinger.setCollidables(collidables)
    this.wallRunner = new WallRunner()
    this.wallRunner.setCollidables(collidables)

    // Systems
    this.input = new InputHandler(this.canvas)
    this.cameraCtrl = new CameraController(
      this.camera)
    this.audio = new AudioSystem()

    // Collectibles
    this.collectibles = new CollectibleSystem(
      this.scene)
    this.collectibles.setOnCollect(() => {
      this.audio.playCollect()
      this.collectibles.flashScreen()
      this.hud.bounceFilmCounter()
    })
    this.collectibles.setOnAllCollected(() => {
      this.showVictory()
    })

    // UI
    this.hud = new GameHUD()
    this.victory = new VictoryScreen()
    this.victory.setOnRestart(() => {
      window.location.reload()
    })

    // Initialize 3D Start Screen Assets
    this.initTitleScreen()
  }

  private initTitleScreen(): void {
    this.scene.add(this.titleGroup)

    // 1. Superhero Silhouette (solid black Basic material)
    const silMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const silhouette = new THREE.Group()

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.7), silMat)
    torso.position.y = 1.6
    silhouette.add(torso)

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 10), silMat)
    head.position.y = 2.7
    silhouette.add(head)

    // Left Arm extended back
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.5, 6), silMat)
    leftArm.position.set(-0.8, 2.0, -0.4)
    leftArm.rotation.set(0.5, 0, 0.6)
    silhouette.add(leftArm)

    // Right Arm extended forward (shooting web pose)
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.5, 6), silMat)
    rightArm.position.set(0.8, 2.2, 0.6)
    rightArm.rotation.set(-1.1, 0, -0.6)
    silhouette.add(rightArm)

    // Left leg bent
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 1.2, 6), silMat)
    leftLeg.position.set(-0.45, 0.6, -0.2)
    leftLeg.rotation.set(0.6, 0, 0.2)
    silhouette.add(leftLeg)

    // Right leg straight
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 1.2, 6), silMat)
    rightLeg.position.set(0.45, 0.6, 0.4)
    rightLeg.rotation.set(-0.4, 0, -0.2)
    silhouette.add(rightLeg)

    // Position silhouette in street canyon between buildings
    silhouette.position.set(0, 52, -50)
    silhouette.rotation.y = 0.5
    this.titleGroup.add(silhouette)

    // Motion blur lines behind hero silhouette
    const trailMat = new THREE.MeshBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.25
    })
    for (let i = 0; i < 3; i++) {
      const trail = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 6), trailMat)
      trail.position.set(silhouette.position.x - 1 + i * 0.5, silhouette.position.y - 1, silhouette.position.z - 3 - i * 2)
      trail.rotation.y = silhouette.rotation.y
      this.titleGroup.add(trail)
    }

    // 2. Web lines extending from hands to nearby building anchor points
    const webMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    
    // Left hand web (extending to tall high-rise)
    const webLGeo = new THREE.CylinderGeometry(0.04, 0.04, 1, 6)
    const webL = new THREE.Mesh(webLGeo, webMat)
    this.titleGroup.add(webL)

    // Right hand web (extending to Daily Bugle corner)
    const webRGeo = new THREE.CylinderGeometry(0.04, 0.04, 1, 6)
    const webR = new THREE.Mesh(webRGeo, webMat)
    this.titleGroup.add(webR)

    const handLPos = new THREE.Vector3(-0.8, 54.2, -50.4)
    const bldgLPos = new THREE.Vector3(-35, 80, -75)
    const dirL = bldgLPos.clone().sub(handLPos)
    const lenL = dirL.length()
    webL.position.copy(handLPos).add(dirL.clone().multiplyScalar(0.5))
    webL.scale.set(1, lenL, 1)
    webL.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirL.normalize())

    const handRPos = new THREE.Vector3(0.8, 54.2, -49.4)
    const bldgRPos = new THREE.Vector3(-10, 130, -15)
    const dirR = bldgRPos.clone().sub(handRPos)
    const lenR = dirR.length()
    webR.position.copy(handRPos).add(dirR.clone().multiplyScalar(0.5))
    webR.scale.set(1, lenR, 1)
    webR.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirR.normalize())

    // 3. Spawn floating newspapers
    const paperMat = new THREE.MeshBasicMaterial({
      color: 0xDDDDDD,
      side: THREE.DoubleSide
    })
    for (let i = 0; i < 8; i++) {
      const paperGeo = new THREE.PlaneGeometry(1.2, 0.9)
      const paper = new THREE.Mesh(paperGeo, paperMat)
      paper.position.set(
        randomRange(-25, 25),
        randomRange(20, 75),
        randomRange(-85, -35)
      )
      paper.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
      ;(paper as any).spinSpeed = new THREE.Vector3(randomRange(-1, 1), randomRange(-1.5, 1.5), randomRange(-0.5, 0.5))
      ;(paper as any).driftSpeed = new THREE.Vector3(randomRange(-1, 2), randomRange(-4, -6), randomRange(-0.5, 0.5))
      this.titleGroup.add(paper)
      this.newspapers.push(paper)
    }

    // 4. Spawn floating comic particles (orange/yellow sparks)
    const partColors = [0xFFAD00, 0xFF7A3B, 0xFFEA88]
    for (let i = 0; i < 25; i++) {
      const partGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35)
      const partMat = new THREE.MeshBasicMaterial({
        color: partColors[i % partColors.length]
      })
      const part = new THREE.Mesh(partGeo, partMat)
      part.position.set(
        randomRange(-30, 30),
        randomRange(10, 80),
        randomRange(-90, -30)
      )
      ;(part as any).riseSpeed = randomRange(6, 11)
      ;(part as any).driftX = randomRange(-0.4, 0.4)
      this.titleGroup.add(part)
      this.menuParticles.push(part)
    }

    // 5. Spawn flapping birds flying across the sky in the distance
    const birdMat = new THREE.MeshBasicMaterial({ color: 0x11052C })
    for (let i = 0; i < 5; i++) {
      const birdGroup = new THREE.Group()
      
      const wingL = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.4), birdMat)
      wingL.position.x = -0.6
      wingL.name = 'wingL'
      birdGroup.add(wingL)

      const wingR = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.4), birdMat)
      wingR.position.x = 0.6
      wingR.name = 'wingR'
      birdGroup.add(wingR)

      birdGroup.position.set(
        randomRange(-160, -60), // Start far left
        randomRange(130, 210),  // High in the sky
        randomRange(-240, -140) // Far away
      )
      ;(birdGroup as any).speedX = randomRange(18, 28)
      ;(birdGroup as any).speedY = randomRange(-1, 1)

      this.titleGroup.add(birdGroup)
      this.titleBirds.push(birdGroup)
    }
  }

  startTitleAudio(): void {
    this.audio.init()
    this.audio.playTitleAmbience()
    this.audio.playTitleMusic()
  }

  triggerStartTransition(): void {
    if (this.gameState !== 'TITLE') return
    
    // Play transition sound effects & stop start screen loops
    this.audio.playTransitionWhoosh()
    this.audio.stopTitleMusic()
    this.audio.stopTitleAmbience()

    // Save transition starting camera coordinate matrices
    this.transitionStartPos.copy(this.camera.position)
    this.transitionStartQuat.copy(this.camera.quaternion)

    this.gameState = 'TRANSITION'
    this.transitionTime = 0

    // Display the HUD element block immediately
    const hudEl = document.getElementById('hud')
    if (hudEl) {
      hudEl.style.display = 'block'
    }
  }

  start(): void {
    this.gameState = 'PLAYING'
    this.audio.init()
    this.hud.start()
    this.clock.getDelta() // Reset clock delta

    // Remove start screen specific meshes
    this.scene.remove(this.titleGroup)
  }

  private loop(): void {
    if (!this.isRunning) return
    this.animId = requestAnimationFrame(
      () => this.loop())
    const delta = Math.min(
      this.clock.getDelta(), 0.05)
    this.update(delta)
    this.renderer.render(this.scene, this.camera)
  }

  private update(delta: number): void {
    if (this.isGameOver) return

    // Update general clouds
    this.updateClouds(delta)

    // Handle states
    if (this.gameState === 'TITLE') {
      this.updateTitleScreen(delta)
      return
    }

    if (this.gameState === 'TRANSITION') {
      this.updateTransition(delta)
      return
    }

    // Normal Gameplay loop
    const inputState = this.input.getState(
      this.cameraCtrl.getYaw())

    if (inputState.swapHero) {
      this.toggleHero()
    }

    const isHulk = this.physics.heroType === 'HULK'
    const forwardDir = this.cameraCtrl
      .getForwardDir()

    // Check web anchor every frame (only for Spidey)
    const hasAnchor = !isHulk && this.webSlinger
      .checkAnchor(
        this.physics.position, forwardDir)

    // Update airTime
    if (this.physics.state === 'GROUNDED' || this.physics.state === 'WALL_CRAWLING') {
      this.airTime = 0
    } else {
      this.airTime += delta
    }

    // Web swing
    const wasSwinging = this.webSlinger.getIsSwinging()
    const webPressedThisFrame = inputState.webHeld && !this.wasWebHeldLastFrame
    this.wasWebHeldLastFrame = inputState.webHeld

    const canSwing = !wasSwinging && hasAnchor && 
                     this.physics.state !== 'GROUNDED' && 
                     this.physics.state !== 'WALL_CRAWLING'
    const swingInputActive = webPressedThisFrame || (inputState.webHeld && this.airTime >= 0.15)

    if (!isHulk && swingInputActive && canSwing) {
      this.webSlinger.startSwing(this.physics.position)
      this.physics.isSwinging = true
      this.physics.anchorPoint.copy(this.webSlinger.getAnchorPoint())
      this.physics.ropeLength = this.webSlinger.getRopeLength()
      this.audio.playWebShoot()
    }

    if (wasSwinging && (isHulk || !inputState.webHeld)) {
      this.webSlinger.stopSwing()
      this.physics.releaseSwing(forwardDir)
    }

    const isSwinging = !isHulk && this.webSlinger
      .getIsSwinging()

    const isWallCrawling = this.physics.state === 'WALL_CRAWLING'

    const isWallRunning = !isHulk && !isWallCrawling && this.wallRunner.update(
      delta,
      this.physics.position,
      this.physics.velocity,
      inputState.moveDir
    )

    // Trick control key checks during falling/jumping/swinging states
    if (this.physics.state === 'JUMPING' || this.physics.state === 'FALLING' || this.physics.state === 'SWINGING') {
      if (this.input.isKeyPressed('Digit1')) {
        this.playerRenderer.triggerTrick('front_flip')
      } else if (this.input.isKeyPressed('Digit2')) {
        this.playerRenderer.triggerTrick('back_flip')
      } else if (this.input.isKeyPressed('Digit3')) {
        this.playerRenderer.triggerTrick('barrel_roll')
      }
    }

    // Wall running jump trigger
    if (isWallRunning && inputState.jumping) {
      const wjv = this.wallRunner
        .getWallJumpVelocity()
      this.physics.applySwingVelocity(wjv)
      this.wallRunner.stopWallRun()
    }

    // Call physics update every frame (handles constraint swinging & wall crawling)
    this.physics.update(
      delta,
      inputState.moveDir,
      inputState.jumping,
      inputState.sprinting,
      isSwinging
    )

    // Update props/traffic
    this.props.update(delta)

    // Update renderer
    this.playerRenderer.setPosition(
      this.physics.position)
    this.playerRenderer.setRotationY(
      this.physics.facingAngle)
    this.playerRenderer.update(
      delta,
      this.physics.velocity,
      isSwinging,
      isWallRunning,
      isSwinging ? this.webSlinger.getAnchorPoint() : null,
      isWallCrawling,
      this.webSlinger.getActiveWristIsLeft(),
      this.physics.state
    )

    // Update camera
    this.cameraCtrl.update(
      delta,
      this.physics.position,
      inputState.cameraDelta,
      isSwinging,
      isWallRunning,
      this.physics.velocity,
      isWallCrawling
    )

    // Collectibles
    this.collectibles.update(
      delta, this.physics.position)

    // HUD
    this.hud.update(
      delta,
      this.physics.position,
      this.collectibles.getNearest(
        this.physics.position),
      this.cameraCtrl.getYaw(),
      this.physics.state,
      hasAnchor,
      this.collectibles.getTotalCollected(),
      this.physics.heroType,
      this.physics.velocity.length()
    )

    // Debug panel update
    const debugEl = document.getElementById('debug-log')
    if (debugEl) {
      debugEl.innerHTML = `
        <strong>DEBUG LOG</strong><br/>
        Win: ${window.innerWidth}x${window.innerHeight} | Canvas: ${this.canvas.width}x${this.canvas.height}<br/>
        Scene Children: ${this.scene.children.length}<br/>
        Player: ${this.physics.position.x.toFixed(2)}, ${this.physics.position.y.toFixed(2)}, ${this.physics.position.z.toFixed(2)}<br/>
        Camera Pos: ${this.camera.position.x.toFixed(2)}, ${this.camera.position.y.toFixed(2)}, ${this.camera.position.z.toFixed(2)}<br/>
        Camera Rot: ${this.camera.rotation.x.toFixed(2)}, ${this.camera.rotation.y.toFixed(2)}, ${this.camera.rotation.z.toFixed(2)}<br/>
        Camera FOV/Near/Far: ${this.camera.fov.toFixed(1)} / ${this.camera.near} / ${this.camera.far}<br/>
        Yaw: ${this.cameraCtrl.getYaw().toFixed(2)} | Pitch: ${(this.cameraCtrl as any).pitch.toFixed(2)}<br/>
        State: ${this.physics.state} | Anchor: ${hasAnchor}<br/>
        Buildings: ${this.city.getBuildings().length} | Collected: ${this.collectibles.getTotalCollected()}
      `
    }
  }

  private updateTitleScreen(delta: number): void {
    this.introCameraTime += delta

    // 1. Slow upward camera panning look-up animation between concrete canyons
    const cx = 8 + Math.sin(this.introCameraTime * 0.2) * 5
    const cy = 18 + this.introCameraTime * 3.2
    const cz = -85 + Math.cos(this.introCameraTime * 0.15) * 4
    
    this.camera.position.set(cx, cy, cz)

    // Camera lookAt point near the superhero silhouette
    const target = new THREE.Vector3(0, 52 + Math.sin(this.introCameraTime * 0.3) * 3, -50)
    this.camera.lookAt(target)

    // 2. Animate falling and spinning newspapers
    this.newspapers.forEach(paper => {
      paper.rotation.x += (paper as any).spinSpeed.x * delta
      paper.rotation.y += (paper as any).spinSpeed.y * delta
      paper.rotation.z += (paper as any).spinSpeed.z * delta

      paper.position.x += (paper as any).driftSpeed.x * delta
      paper.position.y += (paper as any).driftSpeed.y * delta
      paper.position.z += (paper as any).driftSpeed.z * delta

      if (paper.position.y < 12) {
        paper.position.y = 80
        paper.position.x = randomRange(-25, 25)
        paper.position.z = randomRange(-85, -35)
      }
    })

    // 3. Animate rising comic sparks
    this.menuParticles.forEach(part => {
      part.position.y += (part as any).riseSpeed * delta
      part.position.x += (part as any).driftX * delta
      
      if (part.position.y > 90) {
        part.position.y = 10
        part.position.x = randomRange(-30, 30)
      }
    })

    // 4. Animate flapping birds high in the sunset sky
    this.titleBirds.forEach(bird => {
      bird.position.x += (bird as any).speedX * delta
      bird.position.y += (bird as any).speedY * delta
      
      const wingL = bird.getObjectByName('wingL')!
      const wingR = bird.getObjectByName('wingR')!
      const flap = Math.sin(this.introCameraTime * 12 + bird.position.x * 0.25) * 0.6
      wingL.rotation.z = flap
      wingR.rotation.z = -flap

      if (bird.position.x > 150) {
        bird.position.x = -150
        bird.position.y = randomRange(140, 210)
      }
    })
  }

  private updateTransition(delta: number): void {
    this.transitionTime += delta
    const t = Math.min(this.transitionTime / this.transitionDuration, 1.0)
    
    // Smooth cubic ease-in-out curve
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    // Update title props so they don't freeze instantly
    this.newspapers.forEach(paper => {
      paper.position.y += (paper as any).driftSpeed.y * delta
    })
    this.titleBirds.forEach(bird => {
      bird.position.x += (bird as any).speedX * delta
    })

    // Compute gameplay tracking camera target matrix
    this.cameraCtrl.update(
      delta,
      this.physics.position,
      new THREE.Vector2(), // No manual user camera inputs during fly-through
      false,
      false,
      this.physics.velocity
    )
    
    const targetPos = this.camera.position.clone()
    const targetQuat = this.camera.quaternion.clone()

    // Slerp camera orientation and Lerp position from start screen to starting gameplay position
    this.camera.position.lerpVectors(this.transitionStartPos, targetPos, ease)
    this.camera.quaternion.slerpQuaternions(this.transitionStartQuat, targetQuat, ease)

    // Seamlessly begin gameplay
    if (t >= 1.0) {
      this.start()
    }
  }

  private showVictory(): void {
    this.isGameOver = true
    this.hud.stop()
    this.audio.playVictory()
    this.victory.show(this.hud.getElapsed())
  }

  stop(): void {
    this.isRunning = false
    cancelAnimationFrame(this.animId)
  }

  onResize(): void {
    this.camera.aspect = 
      window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(
      window.innerWidth, window.innerHeight)
  }

  private createClouds(): void {
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xfff0e0, // Slightly tinted orange/white
      transparent: true,
      opacity: 0.85
    })
    
    for (let i = 0; i < 20; i++) {
      const cloudGroup = new THREE.Group()
      const numBlocks = Math.floor(3 + Math.random() * 3)
      for (let b = 0; b < numBlocks; b++) {
        const bw = 15 + Math.random() * 25
        const bh = 5 + Math.random() * 8
        const bd = 10 + Math.random() * 15
        const boxGeo = new THREE.BoxGeometry(bw, bh, bd)
        const mesh = new THREE.Mesh(boxGeo, cloudMat)
        mesh.position.set(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 20
        )
        cloudGroup.add(mesh)
      }
      
      const cx = (Math.random() - 0.5) * 1200
      const cy = 160 + Math.random() * 120
      const cz = (Math.random() - 0.5) * 1200
      cloudGroup.position.set(cx, cy, cz)
      ;(cloudGroup as any).speed = (2 + Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)
      
      this.scene.add(cloudGroup)
      this.clouds.push(cloudGroup)
    }
  }

  private updateClouds(delta: number): void {
    this.clouds.forEach(cloud => {
      cloud.position.x += (cloud as any).speed * delta
      if (Math.abs(cloud.position.x) > 800) {
        cloud.position.x = -Math.sign(cloud.position.x) * 800
        cloud.position.z = (Math.random() - 0.5) * 1200
      }
    })
  }

  toggleHero(): void {
    const newHero = this.physics.heroType === 'SPIDERMAN' ? 'HULK' : 'SPIDERMAN'
    this.physics.heroType = newHero
    this.playerRenderer.setHero(newHero)
    this.audio.playCollect()
    
    const switchBtn = document.getElementById('btn-switch')
    if (switchBtn) {
      if (newHero === 'HULK') {
        switchBtn.textContent = 'SPIDER-MAN'
        switchBtn.style.background = '#CC0000'
      } else {
        switchBtn.textContent = 'HULK'
        switchBtn.style.background = '#2E8B57'
      }
    }
  }

  private createSmashParticles(pos: THREE.Vector3): void {
    for (let i = 0; i < 20; i++) {
      const pGeo = new THREE.SphereGeometry(0.3, 4, 4)
      const pMat = new THREE.MeshBasicMaterial({
        color: 0x2E8B57, // Green smash dust
        transparent: true,
        opacity: 0.8
      })
      const pm = new THREE.Mesh(pGeo, pMat)
      pm.position.copy(pos)
      pm.position.y = 0.5
      this.scene.add(pm)

      const angle = Math.random() * Math.PI * 2
      const speed = 4 + Math.random() * 8
      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        1 + Math.random() * 4,
        Math.sin(angle) * speed
      )

      ;(this.collectibles as any).particles.push({
        mesh: pm,
        velocity,
        life: 0.5,
        maxLife: 0.5
      })
    }
  }
}
