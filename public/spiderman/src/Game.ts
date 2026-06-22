import * as THREE from 'three'
import { CityGenerator } from 
  './world/CityGenerator'
import { StreetGenerator } from 
  './world/StreetGenerator'
import { PropsGenerator } from 
  './world/PropsGenerator'
import { PlayerPhysics } from 
  './player/PlayerPhysics'
import { PlayerRenderer } from 
  './player/PlayerRenderer'
import { WebSlinger } from 
  './player/WebSlinger'
import { WallRunner } from 
  './player/WallRunner'
import { InputHandler } from 
  './systems/InputHandler'
import { CameraController } from 
  './systems/CameraController'
import { CollectibleSystem } from 
  './systems/CollectibleSystem'
import { AudioSystem } from 
  './systems/AudioSystem'
import { GameHUD } from './ui/GameHUD'
import { VictoryScreen } from 
  './ui/VictoryScreen'

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

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.init()
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
    this.scene.background = 
      new THREE.Color('#87CEEB')
    this.scene.fog = new THREE.Fog(
      '#87CEEB', 200, 600)

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1, 1000
    )
    this.camera.position.set(0, 10, 20)

    // Lights
    const ambient = new THREE.AmbientLight(
      0xffffff, 0.6)
    this.scene.add(ambient)
    const sun = new THREE.DirectionalLight(
      0xffffff, 1.2)
    sun.position.set(100, 200, 100)
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

    // Player
    this.physics = new PlayerPhysics()
    this.physics.setCollidables(collidables)
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
  }

  start(): void {
    this.isRunning = true
    this.audio.init()
    this.hud.start()
    this.clock.start()
    this.loop()
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

    const inputState = this.input.getState(
      this.cameraCtrl.getYaw())

    const forwardDir = this.cameraCtrl
      .getForwardDir()

    // Check web anchor every frame
    const hasAnchor = this.webSlinger
      .checkAnchor(
        this.physics.position, forwardDir)

    // Web swing
    const wasSwinging = this.webSlinger
      .getIsSwinging()

    if (inputState.webHeld && 
        !wasSwinging && hasAnchor &&
        this.physics.state !== 'GROUNDED') {
      this.webSlinger.startSwing(
        this.physics.position)
      this.audio.playWebShoot()
    }

    if (!inputState.webHeld && wasSwinging) {
      const launchVel = this.webSlinger.stopSwing()
      this.physics.applySwingVelocity(launchVel)
      this.physics.state = 'FALLING'
    }

    const isSwinging = this.webSlinger
      .getIsSwinging()

    if (isSwinging) {
      const swingDelta = this.webSlinger.update(
        delta, this.physics.position)
      if (swingDelta) {
        this.physics.position.add(swingDelta)
        this.physics.state = 'SWINGING' as any
      }
      if (this.physics.position.y < 2) {
        this.webSlinger.stopSwing()
      }
    } else {
      // Wall running
      const isWallRunning = this.wallRunner.update(
        delta,
        this.physics.position,
        this.physics.velocity,
        inputState.moveDir
      )

      if (isWallRunning && 
          inputState.jumping) {
        const wjv = this.wallRunner
          .getWallJumpVelocity()
        this.physics.applySwingVelocity(wjv)
        this.wallRunner.stopWallRun()
      }

      // Normal physics
      this.physics.update(
        delta,
        inputState.moveDir,
        inputState.jumping,
        inputState.sprinting,
        false
      )
    }

    // Update renderer
    this.playerRenderer.setPosition(
      this.physics.position)
    this.playerRenderer.setRotationY(
      this.physics.facingAngle)
    this.playerRenderer.update(
      delta,
      this.physics.velocity,
      isSwinging,
      this.wallRunner.getIsWallRunning()
    )

    // Update camera
    this.cameraCtrl.update(
      delta,
      this.physics.position,
      inputState.cameraDelta,
      isSwinging,
      this.wallRunner.getIsWallRunning(),
      this.physics.velocity
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
      this.collectibles.getTotalCollected()
    )
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
}
