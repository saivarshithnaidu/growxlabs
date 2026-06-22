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
  private isRunning: boolean = false
  private elapsed: number = 0

  constructor() {
    this.filmCounter = document
      .getElementById('film-counter')!
    this.timerEl = document
      .getElementById('timer')!
    this.crosshair = document
      .getElementById('crosshair')!
    this.badgeSwing = document
      .getElementById('badge-swing')!
    this.badgeWall = document
      .getElementById('badge-wall')!
    this.badgeAir = document
      .getElementById('badge-air')!
    this.compass = new Compass()
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
    collected: number
  ): void {
    if (this.isRunning) {
      this.elapsed += delta
    }

    // Timer
    const mins = Math.floor(this.elapsed / 60)
    const secs = Math.floor(this.elapsed % 60)
    this.timerEl.textContent = 
      `⏱ ${mins.toString().padStart(2,'0')}:${
        secs.toString().padStart(2,'0')}`
    this.timerEl.style.color = 
      this.elapsed > 180 ? '#CC0000' : '#000'

    // Film counter
    this.filmCounter.textContent = 
      `🎬 FILM: ${collected}/10`

    // Crosshair
    if (hasAnchor) {
      this.crosshair.classList.add('anchor-found')
    } else {
      this.crosshair.classList.remove('anchor-found')
    }

    // State badges
    this.badgeSwing.classList.toggle(
      'active', playerState === 'SWINGING')
    this.badgeWall.classList.toggle(
      'active', playerState === 'WALL_RUNNING')
    this.badgeAir.classList.toggle(
      'active', 
      playerState === 'JUMPING' || 
      playerState === 'FALLING')

    // Compass
    this.compass.update(
      playerPos, nearestFilm, cameraYaw)
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
