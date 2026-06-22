import * as THREE from 'three'
import { randomRange, randomFrom, createToonRamp } from '../utils/MathUtils'

interface Building {
  mesh: THREE.Mesh
  box: THREE.Box3
}

export class CityGenerator {
  private scene: THREE.Scene
  private buildings: Building[] = []
  private collidables: THREE.Mesh[] = []
  private ramp = createToonRamp()

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  generate(): void {
    this.createBlocks()
    this.createDailyBugle()
    this.createTimesSquare()
  }

  private createSignTexture(text: string, bgColor: string, textColor: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Comic border
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 10
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10)
    
    // Text
    ctx.fillStyle = textColor
    ctx.font = 'bold 38px Impact, Arial Black, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#000000'
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 4
    ctx.shadowOffsetY = 4
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    return texture
  }

  private createBlocks(): void {
    // Warm comic-book sunset colors for buildings
    const colors = [
      0x503040, // Dark violet-rose
      0x2B2D42, // Steel blue-indigo
      0xD90429, // Spidey crimson
      0x8D99AE, // Cool grey
      0xE29578, // Terracotta sunset
      0x3D348B, // Deep blue-violet
      0xF7B801  // Golden orange
    ]
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    for (let bx = -5; bx <= 5; bx++) {
      for (let bz = -5; bz <= 5; bz++) {
        if (bx === 0 && bz === 0) continue

        const blockX = bx * 100
        const blockZ = bz * 100
        const numBuildings = Math.floor(randomRange(1, 4))

        for (let b = 0; b < numBuildings; b++) {
          const w = randomRange(22, 45)
          const h = randomRange(40, 160)
          const d = randomRange(22, 45)
          const color = randomFrom(colors)

          const offsetX = randomRange(-20, 20)
          const offsetZ = randomRange(-20, 20)

          const geo = new THREE.BoxGeometry(w, h, d)
          const mat = new THREE.MeshToonMaterial({
            color,
            gradientMap: this.ramp
          })
          const mesh = new THREE.Mesh(geo, mat)
          mesh.position.set(
            blockX + offsetX,
            h / 2,
            blockZ + offsetZ
          )
          mesh.castShadow = true
          mesh.receiveShadow = true
          mesh.name = 'building'
          this.scene.add(mesh)

          // Outline extrusion
          const outlineThickness = 0.6
          const outlineGeo = new THREE.BoxGeometry(
            w + outlineThickness,
            h + outlineThickness,
            d + outlineThickness
          )
          const outline = new THREE.Mesh(outlineGeo, outlineMat)
          outline.position.copy(mesh.position)
          this.scene.add(outline)

          // Windows
          this.addWindows(mesh.position, w, h, d)

          // Fire Escapes (on 40% of taller buildings)
          if (h > 60 && Math.random() > 0.6) {
            this.addFireEscape(mesh.position, w, h, d)
          }

          // Rooftop details
          this.addRooftopDetails(mesh.position, w, h, d)

          const building: Building = {
            mesh,
            box: new THREE.Box3().setFromObject(mesh)
          }
          this.buildings.push(building)
          this.collidables.push(mesh)
        }
      }
    }
  }

  private addWindows(
    pos: THREE.Vector3,
    w: number, h: number, d: number
  ): void {
    // Array of emissive window materials (warm yellow, deep orange, cool blue, cyan)
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xFFEA88 }),
      new THREE.MeshBasicMaterial({ color: 0xFF9E00 }),
      new THREE.MeshBasicMaterial({ color: 0x4CC9F0 }),
      new THREE.MeshBasicMaterial({ color: 0x00F5D4 })
    ]

    const cols = Math.max(3, Math.floor(w / 7))
    const rows = Math.max(4, Math.floor(h / 9))

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        // Leave some windows dark for realistic comic pattern
        if (Math.random() > 0.75) continue
        
        const winMat = materials[Math.floor(Math.random() * materials.length)]
        const winGeo = new THREE.PlaneGeometry(1.6, 2.5)
        const wx = pos.x - w/2 + (col + 0.5) * (w / cols)
        const wy = 4 + row * (h - 8) / rows
        
        // Front face windows
        const win = new THREE.Mesh(winGeo, winMat)
        win.position.set(wx, wy, pos.z + d/2 + 0.1)
        this.scene.add(win)

        // Back face windows
        const winBack = new THREE.Mesh(winGeo, winMat)
        winBack.position.set(wx, wy, pos.z - d/2 - 0.1)
        winBack.rotation.y = Math.PI
        this.scene.add(winBack)
      }
    }
  }

  private addFireEscape(pos: THREE.Vector3, w: number, h: number, d: number): void {
    const metalMat = new THREE.MeshBasicMaterial({ color: 0x111111 }) // Black comic metal
    const platforms = Math.floor(h / 25)
    
    // Position on one side (let's say positive X side)
    const fx = pos.x + w/2 + 0.8
    const fz = pos.z + randomRange(-d/4, d/4)

    for (let p = 0; p < platforms; p++) {
      const py = 15 + p * 22
      
      // Platform grating
      const platGeo = new THREE.BoxGeometry(1.6, 0.2, 8)
      const plat = new THREE.Mesh(platGeo, metalMat)
      plat.position.set(fx, py, fz)
      this.scene.add(plat)

      // Rails
      const railGeo = new THREE.BoxGeometry(0.1, 1.2, 8)
      const rail = new THREE.Mesh(railGeo, metalMat)
      rail.position.set(fx + 0.7, py + 0.6, fz)
      this.scene.add(rail)

      // Ladder connecting to the next platform
      if (p < platforms - 1) {
        const ladGeo = new THREE.BoxGeometry(0.2, 23, 0.8)
        const ladder = new THREE.Mesh(ladGeo, metalMat)
        ladder.rotation.x = 0.25 // Angled ladder
        ladder.position.set(fx - 0.5, py + 11, fz + 2)
        this.scene.add(ladder)
      }
    }
  }

  private addRooftopDetails(
    pos: THREE.Vector3,
    w: number, h: number, d: number
  ): void {
    // Comic metal material
    const metalMat = new THREE.MeshToonMaterial({
      color: 0x2f3542,
      gradientMap: this.ramp
    })
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    // Water tower
    const towerGroup = new THREE.Group()
    
    // Wooden tank
    const tankGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 8)
    const tankMat = new THREE.MeshToonMaterial({
      color: 0x8c5b36,
      gradientMap: this.ramp
    })
    const tank = new THREE.Mesh(tankGeo, tankMat)
    tank.position.y = 5.5
    tank.castShadow = true
    towerGroup.add(tank)

    // Tank outline
    const tankOutline = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.6, 6.1, 8),
      outlineMat
    )
    tankOutline.position.copy(tank.position)
    towerGroup.add(tankOutline)

    // Metal frame legs
    const frameGeo = new THREE.CylinderGeometry(0.15, 0.15, 5, 4)
    const legs = [
      [-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]
    ]
    legs.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(frameGeo, metalMat)
      leg.position.set(lx, 2.5, lz)
      leg.rotation.z = -lx * 0.08
      leg.rotation.x = lz * 0.08
      towerGroup.add(leg)
    })

    // Place water tower on roof
    towerGroup.position.set(
      pos.x + randomRange(-w/4, w/4),
      h,
      pos.z + randomRange(-d/4, d/4)
    )
    this.scene.add(towerGroup)

    // AC units (glowing ventilation fans)
    const numAC = Math.floor(randomRange(1, 4))
    for (let i = 0; i < numAC; i++) {
      const acGeo = new THREE.BoxGeometry(3.5, 2.2, 3.5)
      const ac = new THREE.Mesh(acGeo, metalMat)
      ac.position.set(
        pos.x + randomRange(-w/3, w/3),
        h + 1.1,
        pos.z + randomRange(-d/3, d/3)
      )
      ac.castShadow = true
      this.scene.add(ac)

      // AC outline
      const acOutline = new THREE.Mesh(
        new THREE.BoxGeometry(3.7, 2.4, 3.7),
        outlineMat
      )
      acOutline.position.copy(ac.position)
      this.scene.add(acOutline)
    }
  }

  private createDailyBugle(): void {
    const bugleColor = 0x800D0D // Dark Crimson brick color
    const geo = new THREE.BoxGeometry(35, 260, 35)
    const mat = new THREE.MeshToonMaterial({
      color: bugleColor,
      gradientMap: this.ramp
    })
    const bugle = new THREE.Mesh(geo, mat)
    bugle.position.set(0, 130, 0)
    bugle.castShadow = true
    bugle.receiveShadow = true
    bugle.name = 'building'
    this.scene.add(bugle)

    // Outline
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })
    const outline = new THREE.Mesh(
      new THREE.BoxGeometry(35.8, 260.8, 35.8),
      outlineMat
    )
    outline.position.copy(bugle.position)
    this.scene.add(outline)

    // Windows for Daily Bugle
    this.addWindows(bugle.position, 35, 260, 35)

    // Huge Daily Bugle Neon Sign at the top!
    const bugleTex = this.createSignTexture('DAILY BUGLE', '#000000', '#FF3333')
    const signMat = new THREE.MeshBasicMaterial({
      map: bugleTex,
      transparent: true,
      side: THREE.DoubleSide
    })

    // Front sign
    const signGeo = new THREE.PlaneGeometry(28, 14)
    const signFront = new THREE.Mesh(signGeo, signMat)
    signFront.position.set(0, 267, 17.6)
    this.scene.add(signFront)

    // Back sign
    const signBack = new THREE.Mesh(signGeo, signMat)
    signBack.position.set(0, 267, -17.6)
    signBack.rotation.y = Math.PI
    this.scene.add(signBack)

    // Sign support truss
    const supportGeo = new THREE.BoxGeometry(30, 1, 35)
    const support = new THREE.Mesh(supportGeo, outlineMat)
    support.position.set(0, 260.5, 0)
    this.scene.add(support)

    this.collidables.push(bugle)
    this.buildings.push({
      mesh: bugle,
      box: new THREE.Box3().setFromObject(bugle)
    })
  }

  private createTimesSquare(): void {
    // Detailed stylized billboards with glowing comic text!
    const ads = [
      { text: 'OSCORP', bg: '#0D1B2A', fg: '#00FF66' },
      { text: 'STARK IND', bg: '#800020', fg: '#FFCC00' },
      { text: 'WEB-SHOOT', bg: '#FF0055', fg: '#FFFFFF' },
      { text: 'DAILY BUGLE', bg: '#000000', fg: '#FF3333' },
      { text: 'PETER PANELS', bg: '#3A0CA3', fg: '#4CC9F0' },
      { text: 'PARKER CO.', bg: '#F72585', fg: '#7209B7' }
    ]

    for (let i = 0; i < ads.length; i++) {
      const ad = ads[i]
      const tex = this.createSignTexture(ad.text, ad.bg, ad.fg)
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
      })

      const w = 18
      const h = 10
      const geo = new THREE.PlaneGeometry(w, h)
      const board = new THREE.Mesh(geo, mat)
      
      const bx = 100 + randomRange(-15, 15)
      const by = 40 + i * 18
      const bz = randomRange(-40, 40)
      board.position.set(bx, by, bz)
      board.rotation.y = randomRange(-Math.PI/6, Math.PI/6)
      this.scene.add(board)

      // Comic black frame for the billboard
      const frameMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
      const frameGeo = new THREE.BoxGeometry(w + 0.8, h + 0.8, 0.4)
      const frame = new THREE.Mesh(frameGeo, frameMat)
      frame.position.copy(board.position)
      frame.rotation.copy(board.rotation)
      frame.position.z -= 0.1 * Math.cos(board.rotation.y)
      frame.position.x -= 0.1 * Math.sin(board.rotation.y)
      this.scene.add(frame)

      // Support metal pole down to building or ground
      const poleGeo = new THREE.CylinderGeometry(0.4, 0.4, 25, 6)
      const pole = new THREE.Mesh(poleGeo, frameMat)
      pole.position.set(bx, by - 12.5, bz)
      pole.rotation.y = board.rotation.y
      this.scene.add(pole)
    }
  }

  getCollidables(): THREE.Mesh[] {
    return this.collidables
  }

  getBuildings(): Building[] {
    return this.buildings
  }

  getBuildingMeshes(): THREE.Mesh[] {
    return this.buildings.map(b => b.mesh)
  }
}
