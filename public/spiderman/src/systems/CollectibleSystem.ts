import * as THREE from 'three'

interface Particle {
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  life: number
  maxLife: number
}

export class CollectibleSystem {
  private scene: THREE.Scene
  private collectibles: THREE.Mesh[] = []
  private collected: boolean[] = []
  private totalCollected: number = 0
  private time: number = 0
  private basYPositions: number[] = []
  private onCollect: (() => void) | null = null
  private onAllCollected: (() => void) | null = null
  private particles: Particle[] = []

  private readonly POSITIONS: 
    [number, number, number][] = [
    [50, 80, 30],
    [-60, 120, -40],
    [80, 55, 80],
    [-30, 170, 10],
    [20, 40, -80],
    [-80, 60, 50],
    [100, 90, -60],
    [-50, 45, -100],
    [0, 250, 0],
    [120, 70, 40],
  ]

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.createCollectibles()
  }

  private createCollectibles(): void {
    const geo = new THREE.CylinderGeometry(
      0.8, 0.8, 0.5, 12)
    const mat = new THREE.MeshBasicMaterial({
      color: 0xFFD700
    })

    this.POSITIONS.forEach((pos) => {
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...pos)
      mesh.castShadow = true
      this.scene.add(mesh)

      const light = new THREE.PointLight(
        0xFFD700, 1.5, 12)
      light.position.set(...pos)
      this.scene.add(light)

      this.collectibles.push(mesh)
      this.collected.push(false)
      this.basYPositions.push(pos[1])
    })
  }

  setOnCollect(cb: () => void): void {
    this.onCollect = cb
  }

  setOnAllCollected(cb: () => void): void {
    this.onAllCollected = cb
  }

  update(
    delta: number,
    playerPos: THREE.Vector3
  ): void {
    this.time += delta

    this.collectibles.forEach((c, i) => {
      if (this.collected[i]) return

      // Animate
      c.rotation.y += delta * 1.5
      c.position.y = this.basYPositions[i] + 
        Math.sin(this.time * 2 + i) * 0.5
      const pulse = 1 + 
        Math.sin(this.time * 3 + i) * 0.15
      c.scale.setScalar(pulse)

      // Check collect
      const dist = playerPos
        .distanceTo(c.position)
      if (dist < 4) {
        this.collect(i)
      }
    })

    // Update particles
    this.particles = this.particles.filter(p => {
      p.life -= delta
      if (p.life <= 0) {
        this.scene.remove(p.mesh)
        return false
      }
      p.mesh.position.add(
        p.velocity.clone().multiplyScalar(delta))
      const opacity = p.life / p.maxLife
      ;(p.mesh.material as 
        THREE.MeshLambertMaterial).opacity = opacity
      return true
    })
  }

  private collect(index: number): void {
    if (this.collected[index]) return
    this.collected[index] = true
    this.totalCollected++

    // Burst particles
    const pos = this.collectibles[index].position
    for (let i = 0; i < 10; i++) {
      const pGeo = new THREE.SphereGeometry(
        0.2, 4, 4)
      const pMat = new THREE.MeshLambertMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 1
      })
      const pm = new THREE.Mesh(pGeo, pMat)
      pm.position.copy(pos)
      this.scene.add(pm)
      this.particles.push({
        mesh: pm,
        velocity: new THREE.Vector3(
          (Math.random()-0.5)*8,
          Math.random()*6,
          (Math.random()-0.5)*8
        ),
        life: 0.8,
        maxLife: 0.8
      })
    }

    this.scene.remove(this.collectibles[index])
    this.onCollect?.()

    if (this.totalCollected >= 10) {
      this.onAllCollected?.()
    }
  }

  getNearest(
    playerPos: THREE.Vector3
  ): THREE.Vector3 | null {
    let nearest: THREE.Vector3 | null = null
    let minDist = Infinity

    this.collectibles.forEach((c, i) => {
      if (this.collected[i]) return
      const d = playerPos.distanceTo(c.position)
      if (d < minDist) {
        minDist = d
        nearest = c.position.clone()
      }
    })
    return nearest
  }

  getTotalCollected(): number {
    return this.totalCollected
  }

  flashScreen(): void {
    const flash = document
      .getElementById('flash-overlay')
    if (!flash) return
    flash.style.opacity = '0.6'
    setTimeout(() => {
      flash.style.opacity = '0'
    }, 300)
  }
}
