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
    const r = 32

    ctx.clearRect(0, 0, w, h)

    // Outer bold comic ring
    ctx.fillStyle = '#111111'
    ctx.beginPath()
    ctx.arc(cx, cy, r + 6, 0, Math.PI * 2)
    ctx.fill()

    // Inner dial background (vibrant comic yellow-orange gradient)
    const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
    grad.addColorStop(0, '#FFD700') // Gold
    grad.addColorStop(1, '#FF5733') // Orange-red
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2)
    ctx.fill()

    // Thin inner black circle
    ctx.strokeStyle = '#111111'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2)
    ctx.stroke()

    // Cardinal directions
    ctx.fillStyle = '#111111'
    ctx.font = 'bold 11px Impact, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const dirs = ['N','E','S','W']
    dirs.forEach((d, i) => {
      const a = (i * Math.PI/2) - cameraYaw
      const tx = cx + Math.sin(a) * (r - 7)
      const ty = cy - Math.cos(a) * (r - 7)
      
      // Draw letter
      ctx.fillText(d, tx, ty)
    })

    // Film arrow
    if (nearestFilm) {
      const dx = nearestFilm.x - playerPos.x
      const dz = nearestFilm.z - playerPos.z
      const angle = Math.atan2(dx, dz) - cameraYaw

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.beginPath()
      ctx.moveTo(2, -18)
      ctx.lineTo(8, 6)
      ctx.lineTo(2, 2)
      ctx.lineTo(-4, 6)
      ctx.closePath()
      ctx.fill()

      // Arrow (Crimson red)
      ctx.fillStyle = '#D90429'
      ctx.strokeStyle = '#111111'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, -20)
      ctx.lineTo(6, 4)
      ctx.lineTo(0, 0)
      ctx.lineTo(-6, 4)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

    // Center dot (Bold white with black outline)
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#111111'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
}
