import * as THREE from 'three'
import { Compass } from './Compass'
import { PlayerState } from '../player/PlayerPhysics'

export class GameHUD {
  private filmCounter: HTMLElement
  private timerEl: HTMLElement
  private crosshair: HTMLElement
  private badgeSwing: HTMLElement
  private badgeWall: HTMLElement
  private badgeAir: HTMLElement
  private compass: Compass
  private scorePanel: HTMLElement
  private comboContainer: HTMLElement
  private comboMultiplier: HTMLElement
  private comboCount: HTMLElement
  private comboScore: HTMLElement
  private isRunning: boolean = false
  private elapsed: number = 0

  // 2D HUD Canvas for Speed Lines and Vignette
  private hudCanvas!: HTMLCanvasElement
  private hudCtx!: CanvasRenderingContext2D

  constructor() {
    this.filmCounter = document.getElementById('film-counter')!
    this.timerEl = document.getElementById('timer')!
    this.crosshair = document.getElementById('crosshair')!
    this.badgeSwing = document.getElementById('badge-swing')!
    this.badgeWall = document.getElementById('badge-wall')!
    this.badgeAir = document.getElementById('badge-air')!
    this.scorePanel = document.getElementById('score-panel')!
    this.comboContainer = document.getElementById('combo-container')!
    this.comboMultiplier = document.getElementById('combo-multiplier')!
    this.comboCount = document.getElementById('combo-count')!
    this.comboScore = document.getElementById('combo-score')!
    this.compass = new Compass()

    this.initHudCanvas()
  }

  private initHudCanvas(): void {
    this.hudCanvas = document.getElementById('hud-canvas') as HTMLCanvasElement
    if (!this.hudCanvas) {
      this.hudCanvas = document.createElement('canvas')
      this.hudCanvas.id = 'hud-canvas'
      this.hudCanvas.style.position = 'absolute'
      this.hudCanvas.style.top = '0'
      this.hudCanvas.style.left = '0'
      this.hudCanvas.style.width = '100vw'
      this.hudCanvas.style.height = '100vh'
      this.hudCanvas.style.pointerEvents = 'none'
      this.hudCanvas.style.zIndex = '5'
      document.body.appendChild(this.hudCanvas)
    }
    this.hudCtx = this.hudCanvas.getContext('2d')!
    this.resizeHudCanvas()
    window.addEventListener('resize', () => this.resizeHudCanvas())
  }

  private resizeHudCanvas(): void {
    this.hudCanvas.width = window.innerWidth
    this.hudCanvas.height = window.innerHeight
  }

  start(): void {
    this.isRunning = true
  }

  update(
    delta: number,
    playerPos: THREE.Vector3,
    nearestFilm: THREE.Vector3 | null,
    cameraYaw: number,
    playerState: PlayerState,
    hasAnchor: boolean,
    collected: number,
    heroType: 'SPIDERMAN' | 'HULK' = 'SPIDERMAN',
    speed: number = 0,
    totalScore: number = 0,
    comboMultiplier: number = 1,
    currentComboStunts: number = 0,
    currentComboScore: number = 0,
    comboActive: boolean = false
  ): void {
    if (this.isRunning) {
      this.elapsed += delta
    }

    // Clear HUD Canvas
    const ctx = this.hudCtx
    const w = this.hudCanvas.width
    const h = this.hudCanvas.height
    ctx.clearRect(0, 0, w, h)

    // Draw Dynamic Speed Lines & Sunset Vignette when going fast!
    if (speed > 20) {
      // Calculate intensity (caps at 1.0 when speed reaches 55)
      const intensity = Math.min((speed - 20) / 35, 1.0)
      this.drawSpeedVignette(intensity)
      this.drawSpeedLines(intensity)
    }

    // Timer
    const mins = Math.floor(this.elapsed / 60)
    const secs = Math.floor(this.elapsed % 60)
    this.timerEl.textContent = 
      `⏱ ${mins.toString().padStart(2,'0')}:${
        secs.toString().padStart(2,'0')}`
    this.timerEl.style.color = 
      this.elapsed > 180 ? '#CC0000' : '#FFF' // Comic-white or warning red

    // Film counter
    this.filmCounter.textContent = 
      `🎬 FILM: ${collected}/10`

    // Score Panel
    this.scorePanel.textContent = `SCORE: ${totalScore}`

    // Combo Panel
    if (comboActive && currentComboStunts > 0) {
      this.comboContainer.classList.add('active')
      this.comboMultiplier.textContent = `${comboMultiplier}x`
      this.comboCount.textContent = `${currentComboStunts} STUNT COMBO`
      this.comboScore.textContent = `Score: +${currentComboScore}`
    } else {
      this.comboContainer.classList.remove('active')
    }

    // Crosshair (only for Spidey)
    if (heroType === 'SPIDERMAN' && hasAnchor) {
      this.crosshair.classList.add('anchor-found')
    } else {
      this.crosshair.classList.remove('anchor-found')
    }

    // State badges
    if (heroType === 'SPIDERMAN') {
      this.badgeSwing.textContent = 'SWINGING'
      this.badgeSwing.classList.toggle(
        'active', playerState === 'SWINGING')
      this.badgeWall.textContent = 'WALL RUN'
      this.badgeWall.classList.toggle(
        'active', playerState === 'WALL_RUNNING')
      this.badgeAir.textContent = 'AIRBORNE'
      this.badgeAir.classList.toggle(
        'active', 
        playerState === 'JUMPING' || 
        playerState === 'FALLING' ||
        playerState === 'SWINGING' ||
        playerState === 'DIVE')
    } else {
      this.badgeSwing.classList.remove('active')
      this.badgeWall.classList.remove('active')
      this.badgeAir.textContent = 
        playerState === 'JUMPING' ? 'LEAPING' : (playerState === 'DIVE' ? 'DIVING' : 'FALLING')
      this.badgeAir.classList.toggle(
        'active', 
        playerState === 'JUMPING' || 
        playerState === 'FALLING' ||
        playerState === 'DIVE')
    }

    // Compass
    this.compass.update(
      playerPos, nearestFilm, cameraYaw)
  }

  private drawSpeedVignette(intensity: number): void {
    const ctx = this.hudCtx
    const w = this.hudCanvas.width
    const h = this.hudCanvas.height

    const grad = ctx.createRadialGradient(
      w / 2, h / 2, Math.min(w, h) * 0.35,
      w / 2, h / 2, Math.max(w, h) * 0.85
    )
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(1, `rgba(62, 6, 95, ${intensity * 0.55})`) // Dark magenta sunset bloom vignette

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
  }

  private drawSpeedLines(intensity: number): void {
    const ctx = this.hudCtx
    const w = this.hudCanvas.width
    const h = this.hudCanvas.height
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.65})`
    ctx.lineWidth = 2.0
    
    const cx = w / 2
    const cy = h / 2

    const numLines = Math.floor(25 + Math.random() * 20)
    for (let i = 0; i < numLines; i++) {
      const angle = Math.random() * Math.PI * 2
      
      const startDist = Math.min(w, h) * (0.33 + Math.random() * 0.15)
      const endDist = Math.min(w, h) * (0.65 + Math.random() * 0.5)

      const x1 = cx + Math.cos(angle) * startDist
      const y1 = cy + Math.sin(angle) * startDist
      const x2 = cx + Math.cos(angle) * endDist
      const y2 = cy + Math.sin(angle) * endDist

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  bounceFilmCounter(): void {
    this.filmCounter.style.transform = 'scale(1.3)'
    setTimeout(() => {
      this.filmCounter.style.transform = 'scale(1)'
    }, 200)
  }

  stop(): void {
    this.isRunning = false
  }

  getElapsed(): number {
    return this.elapsed
  }
}
