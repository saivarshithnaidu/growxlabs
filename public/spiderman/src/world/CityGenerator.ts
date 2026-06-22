import * as THREE from 'three'
import { randomRange, randomFrom } from 
  '../utils/MathUtils'

interface Building {
  mesh: THREE.Mesh
  box: THREE.Box3
}

export class CityGenerator {
  private scene: THREE.Scene
  private buildings: Building[] = []
  private collidables: THREE.Mesh[] = []

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  generate(): void {
    this.createBlocks()
    this.createDailyBugle()
    this.createTimesSquare()
  }

  private createBlocks(): void {
    const colors = [
      0xC4A882, 0x8B6914, 0x708090,
      0x6B8E6B, 0xA0522D, 0x778899
    ]
    const outlineMat = new THREE.MeshLambertMaterial(
      { color: 0x111111, side: THREE.BackSide })

    for (let bx = -4; bx <= 4; bx++) {
      for (let bz = -4; bz <= 4; bz++) {
        if (bx === 0 && bz === 0) continue

        const blockX = bx * 100
        const blockZ = bz * 100
        const numBuildings = Math.floor(
          randomRange(1, 4))

        for (let b = 0; b < numBuildings; b++) {
          const w = randomRange(20, 55)
          const h = randomRange(40, 180)
          const d = randomRange(20, 55)
          const color = randomFrom(colors)

          const offsetX = randomRange(-25, 25)
          const offsetZ = randomRange(-25, 25)

          const geo = new THREE.BoxGeometry(w, h, d)
          const mat = new THREE.MeshLambertMaterial(
            { color })
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

          // Outline
          const outlineGeo = new THREE.BoxGeometry(
            w + 0.3, h + 0.3, d + 0.3)
          const outline = new THREE.Mesh(
            outlineGeo, outlineMat)
          outline.position.copy(mesh.position)
          this.scene.add(outline)

          // Windows
          this.addWindows(
            mesh.position, w, h, d, color)

          // Rooftop details
          if (h > 80) {
            this.addRooftopDetails(
              mesh.position, w, h, d)
          }

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
    w: number, h: number, d: number,
    _baseColor: number
  ): void {
    const winMat = new THREE.MeshLambertMaterial({
      color: 0xFFFFAA,
      emissive: 0xFFFFAA,
      emissiveIntensity: Math.random() > 0.3 
        ? 0.6 : 0.1
    })

    const cols = Math.floor(w / 6)
    const rows = Math.floor(h / 8)

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        if (Math.random() > 0.7) continue
        const winGeo = new THREE.PlaneGeometry(
          2.5, 3.5)
        const win = new THREE.Mesh(winGeo, winMat)
        const wx = pos.x - w/2 + 
          (col + 0.5) * (w / cols)
        const wy = 4 + row * 8
        win.position.set(wx, wy, pos.z + d/2 + 0.1)
        this.scene.add(win)

        const winBack = new THREE.Mesh(
          winGeo, winMat)
        winBack.position.set(
          wx, wy, pos.z - d/2 - 0.1)
        winBack.rotation.y = Math.PI
        this.scene.add(winBack)
      }
    }
  }

  private addRooftopDetails(
    pos: THREE.Vector3,
    _w: number, h: number, _d: number
  ): void {
    // Water tower
    const towerGeo = new THREE.CylinderGeometry(
      2, 2.5, 6, 8)
    const towerMat = new THREE.MeshLambertMaterial(
      { color: 0x8B4513 })
    const tower = new THREE.Mesh(towerGeo, towerMat)
    tower.position.set(
      pos.x + randomRange(-5, 5),
      h + 3,
      pos.z + randomRange(-5, 5)
    )
    this.scene.add(tower)

    // AC units
    for (let i = 0; i < 3; i++) {
      const acGeo = new THREE.BoxGeometry(3, 1.5, 2)
      const acMat = new THREE.MeshLambertMaterial(
        { color: 0x888888 })
      const ac = new THREE.Mesh(acGeo, acMat)
      ac.position.set(
        pos.x + randomRange(-8, 8),
        h + 0.75,
        pos.z + randomRange(-8, 8)
      )
      this.scene.add(ac)
    }
  }

  private createDailyBugle(): void {
    const geo = new THREE.BoxGeometry(30, 250, 30)
    const mat = new THREE.MeshLambertMaterial(
      { color: 0xCC2200 })
    const bugle = new THREE.Mesh(geo, mat)
    bugle.position.set(0, 125, 0)
    bugle.castShadow = true
    bugle.name = 'building'
    this.scene.add(bugle)

    const outlineMat = new THREE.MeshLambertMaterial(
      { color: 0x111111, side: THREE.BackSide })
    const outline = new THREE.Mesh(
      new THREE.BoxGeometry(30.4, 250.4, 30.4),
      outlineMat
    )
    outline.position.copy(bugle.position)
    this.scene.add(outline)

    this.collidables.push(bugle)
    this.buildings.push({
      mesh: bugle,
      box: new THREE.Box3().setFromObject(bugle)
    })
  }

  private createTimesSquare(): void {
    const billboardColors = [
      0xFF0000, 0x00FF00, 0x0000FF,
      0xFF00FF, 0xFFFF00
    ]
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.PlaneGeometry(12, 8)
      const mat = new THREE.MeshLambertMaterial({
        color: billboardColors[i],
        emissive: billboardColors[i],
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
      })
      const board = new THREE.Mesh(geo, mat)
      board.position.set(
        100 + randomRange(-20, 20),
        30 + i * 10,
        randomRange(-30, 30)
      )
      board.rotation.y = randomRange(
        -Math.PI/4, Math.PI/4)
      this.scene.add(board)
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
