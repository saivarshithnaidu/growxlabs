import * as THREE from 'three'

export class Compass {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.getElementById(
      'compass') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')!
  }

  update(
    playerPos: THREE.Vector3,
    nearestFilm: THREE.Vector3 | null,
    cameraYaw: number
  ): void {
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height
    const cx = w / 2
    const cy = h / 2
    const r = 34

    ctx.clearRect(0, 0, w, h)

    // Background
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Cardinal directions
    ctx.fillStyle = '#333'
    ctx.font = 'bold 10px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const dirs = ['N','E','S','W']
    dirs.forEach((d, i) => {
      const a = (i * Math.PI/2) - cameraYaw
      ctx.fillText(d,
        cx + Math.sin(a) * (r - 6),
        cy - Math.cos(a) * (r - 6)
      )
    })

    // Film arrow
    if (nearestFilm) {
      const dx = nearestFilm.x - playerPos.x
      const dz = nearestFilm.z - playerPos.z
      const angle = Math.atan2(dx, dz) - cameraYaw

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.fillStyle = '#FFD700'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, -18)
      ctx.lineTo(6, 8)
      ctx.lineTo(0, 4)
      ctx.lineTo(-6, 8)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

    // Center dot
    ctx.fillStyle = '#CC0000'
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}
