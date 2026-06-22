import * as THREE from 'three'

export class PropsGenerator {
  private scene: THREE.Scene

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  generate(): void {
    this.createLampposts()
    this.createHydrants()
    this.createCars()
  }

  private createLampposts(): void {
    const poleMat = new THREE.MeshLambertMaterial(
      { color: 0x444444 })
    const lightMat = new THREE.MeshLambertMaterial(
      { color: 0xFFFFAA, emissive: 0xFFFFAA,
        emissiveIntensity: 0.8 })

    const positions: [number, number][] = []
    for (let i = -4; i <= 4; i++) {
      for (let j = -15; j <= 15; j++) {
        positions.push([i * 100 + 12, j * 15])
        positions.push([i * 100 - 12, j * 15])
      }
    }

    positions.forEach(([x, z]) => {
      const poleGeo = new THREE.CylinderGeometry(
        0.2, 0.2, 8, 6)
      const pole = new THREE.Mesh(poleGeo, poleMat)
      pole.position.set(x, 4, z)
      pole.castShadow = true
      this.scene.add(pole)

      const bulbGeo = new THREE.SphereGeometry(
        0.5, 6, 6)
      const bulb = new THREE.Mesh(bulbGeo, lightMat)
      bulb.position.set(x, 8.5, z)
      this.scene.add(bulb)

      const light = new THREE.PointLight(
        0xFFFFAA, 0.5, 20)
      light.position.set(x, 8, z)
      this.scene.add(light)
    })
  }

  private createHydrants(): void {
    const mat = new THREE.MeshLambertMaterial(
      { color: 0xFF2200 })
    const positions = [
      [15, 15], [-15, 30], [30, -15],
      [-30, 20], [20, -30], [-20, -20]
    ]
    positions.forEach(([x, z]) => {
      const geo = new THREE.CylinderGeometry(
        0.4, 0.5, 1.2, 8)
      const h = new THREE.Mesh(geo, mat)
      h.position.set(x, 0.6, z)
      h.castShadow = true
      this.scene.add(h)
    })
  }

  private createCars(): void {
    const colors = [
      0xFF3333, 0xFFFF33, 0xFFFFFF,
      0x3333FF, 0x33FF33, 0xFF9900
    ]
    const carPositions = [
      [30, 90], [-30, 90], [50, 190],
      [-50, 190], [30, -90], [-30, -90],
      [90, 30], [90, -30], [190, 50],
      [-90, 30], [-90, -30]
    ]
    carPositions.forEach(([x, z], i) => {
      const bodyGeo = new THREE.BoxGeometry(
        4, 1.5, 8)
      const bodyMat = new THREE.MeshLambertMaterial(
        { color: colors[i % colors.length] })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.position.set(x, 0.75, z)
      body.castShadow = true
      this.scene.add(body)

      const roofGeo = new THREE.BoxGeometry(
        3, 1.2, 4)
      const roof = new THREE.Mesh(roofGeo, bodyMat)
      roof.position.set(x, 1.85, z)
      this.scene.add(roof)
    })
  }
}
