import * as THREE from 'three'
import { createToonRamp } from '../utils/MathUtils'

export class StreetGenerator {
  private scene: THREE.Scene
  private ramp = createToonRamp()

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  generate(): void {
    this.createGround()
    this.createRoads()
    this.createSidewalks()
  }

  private createGround(): void {
    const geo = new THREE.PlaneGeometry(2000, 2000)
    const mat = new THREE.MeshToonMaterial({
      color: 0x221A30, // Deep sunset purple-grey ground
      gradientMap: this.ramp
    })
    const ground = new THREE.Mesh(geo, mat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    ground.name = 'ground'
    this.scene.add(ground)
  }

  private createRoads(): void {
    const roadMat = new THREE.MeshToonMaterial({
      color: 0x15111B, // Dark sunset asphalt
      gradientMap: this.ramp
    })
    // Horizontal roads every 100 units
    for (let i = -4; i <= 4; i++) {
      const geo = new THREE.PlaneGeometry(2000, 20)
      const road = new THREE.Mesh(geo, roadMat)
      road.rotation.x = -Math.PI / 2
      road.position.set(0, 0.1, i * 100)
      road.receiveShadow = true
      this.scene.add(road)

      // Center dashes
      for (let j = -10; j <= 10; j++) {
        const dashGeo = new THREE.PlaneGeometry(
          8, 0.5)
        const dashMat = new THREE.MeshBasicMaterial(
          { color: 0xFFAD00 }) // Sunset orange dashes
        const dash = new THREE.Mesh(dashGeo, dashMat)
        dash.rotation.x = -Math.PI / 2
        dash.position.set(j * 20, 0.15, i * 100)
        this.scene.add(dash)
      }
    }
    // Vertical roads every 100 units
    for (let i = -4; i <= 4; i++) {
      const geo = new THREE.PlaneGeometry(20, 2000)
      const road = new THREE.Mesh(geo, roadMat)
      road.rotation.x = -Math.PI / 2
      road.position.set(i * 100, 0.1, 0)
      road.receiveShadow = true
      this.scene.add(road)
    }
  }

  private createSidewalks(): void {
    const mat = new THREE.MeshToonMaterial({
      color: 0x3E2E55, // violet sidewalk
      gradientMap: this.ramp
    })
    for (let i = -4; i <= 4; i++) {
      for (let j = -4; j <= 4; j++) {
        const geo = new THREE.BoxGeometry(
          78, 0.5, 78)
        const sidewalk = new THREE.Mesh(geo, mat)
        sidewalk.position.set(
          i * 100, 0.25, j * 100)
        sidewalk.receiveShadow = true
        this.scene.add(sidewalk)
      }
    }
  }

  getCollidables(): THREE.Mesh[] { return [] }
}
