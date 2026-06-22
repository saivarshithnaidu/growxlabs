import * as THREE from 'three'
import { createToonRamp, randomRange } from '../utils/MathUtils'

interface Car {
  group: THREE.Group
  direction: THREE.Vector3
  speed: number
  axis: 'x' | 'z'
  fixedCoord: number
}

export class PropsGenerator {
  private scene: THREE.Scene
  private cars: Car[] = []
  private ramp = createToonRamp()
  private trafficTimer: number = 0

  // Shared traffic light materials
  private redMat!: THREE.MeshBasicMaterial
  private yellowMat!: THREE.MeshBasicMaterial
  private greenMat!: THREE.MeshBasicMaterial

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.initTrafficLightMaterials()
  }

  private initTrafficLightMaterials(): void {
    this.redMat = new THREE.MeshBasicMaterial({ color: 0x440000 })
    this.yellowMat = new THREE.MeshBasicMaterial({ color: 0x444400 })
    this.greenMat = new THREE.MeshBasicMaterial({ color: 0x004400 })
  }

  generate(): void {
    this.createLampposts()
    this.createHydrants()
    this.createTrafficLights()
    this.createCars()
    this.createBenches()
    this.createNewsstands()
    this.createBuses()
  }

  private createLampposts(): void {
    const poleMat = new THREE.MeshToonMaterial({
      color: 0x2C3A47, // Dark steel grey
      gradientMap: this.ramp
    })
    const lightMat = new THREE.MeshBasicMaterial({
      color: 0xFFF275 // Warm golden glow
    })
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    const positions: [number, number][] = []
    for (let i = -4; i <= 4; i++) {
      for (let j = -8; j <= 8; j++) {
        // Place along road sides
        positions.push([i * 100 + 11.5, j * 25])
        positions.push([i * 100 - 11.5, j * 25])
      }
    }

    positions.forEach(([x, z]) => {
      const lamppostGroup = new THREE.Group()

      // Pole
      const poleGeo = new THREE.CylinderGeometry(0.18, 0.25, 8.5, 6)
      const pole = new THREE.Mesh(poleGeo, poleMat)
      pole.position.y = 4.25
      pole.castShadow = true
      lamppostGroup.add(pole)

      // Pole outline
      const poleOutline = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.31, 8.6, 6),
        outlineMat
      )
      poleOutline.position.copy(pole.position)
      lamppostGroup.add(poleOutline)

      // Horizontal arm
      const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 5)
      const arm = new THREE.Mesh(armGeo, poleMat)
      arm.rotation.z = Math.PI / 2
      arm.position.set(-0.8, 8.2, 0)
      lamppostGroup.add(arm)

      // Bulb
      const bulbGeo = new THREE.SphereGeometry(0.45, 6, 6)
      const bulb = new THREE.Mesh(bulbGeo, lightMat)
      bulb.position.set(-1.8, 7.9, 0)
      lamppostGroup.add(bulb)

      // Bulb outline
      const bulbOutline = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 6, 6),
        outlineMat
      )
      bulbOutline.position.copy(bulb.position)
      lamppostGroup.add(bulbOutline)

      // Light source (fewer lights for mobile performance)
      if (Math.abs(x) < 300 && Math.abs(z) < 300 && Math.random() > 0.5) {
        const light = new THREE.PointLight(0xFFF275, 0.8, 25)
        light.position.set(-1.8, 7.5, 0)
        lamppostGroup.add(light)
      }

      lamppostGroup.position.set(x, 0.25, z)
      this.scene.add(lamppostGroup)
    });
  }

  private createHydrants(): void {
    const mat = new THREE.MeshToonMaterial({
      color: 0xEA2027, // Vibrant comic red
      gradientMap: this.ramp
    })
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    const positions = [
      [14, 15], [-14, 35], [35, -14],
      [-35, 20], [20, -35], [-20, -20],
      [114, 115], [-114, 135], [135, -114]
    ]

    positions.forEach(([x, z]) => {
      const hydrantGroup = new THREE.Group()

      const geo = new THREE.CylinderGeometry(0.35, 0.45, 1.4, 8)
      const h = new THREE.Mesh(geo, mat)
      h.position.y = 0.7
      h.castShadow = true
      hydrantGroup.add(h)

      const outline = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.52, 1.5, 8),
        outlineMat
      )
      outline.position.copy(h.position)
      hydrantGroup.add(outline)

      // Cap details
      const capGeo = new THREE.SphereGeometry(0.4, 6, 6)
      const cap = new THREE.Mesh(capGeo, mat)
      cap.position.y = 1.4
      hydrantGroup.add(cap)

      hydrantGroup.position.set(x, 0.25, z)
      this.scene.add(hydrantGroup)
    })
  }

  private createTrafficLights(): void {
    const poleMat = new THREE.MeshToonMaterial({
      color: 0x1E272C, // Black/Dark metallic
      gradientMap: this.ramp
    })
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    // Place at intersections (-300 to 300 grid)
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        const ix = i * 100
        const iz = j * 100

        const tlGroup = new THREE.Group()

        // Main Pole
        const poleGeo = new THREE.CylinderGeometry(0.22, 0.28, 12, 6)
        const pole = new THREE.Mesh(poleGeo, poleMat)
        pole.position.y = 6
        pole.castShadow = true
        tlGroup.add(pole)

        const poleOutline = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.34, 12.1, 6),
          outlineMat
        )
        poleOutline.position.copy(pole.position)
        tlGroup.add(poleOutline)

        // Mast Arm
        const armGeo = new THREE.CylinderGeometry(0.14, 0.14, 5, 5)
        const arm = new THREE.Mesh(armGeo, poleMat)
        arm.rotation.z = Math.PI / 2
        arm.position.set(-2.5, 11.5, 0)
        tlGroup.add(arm)

        // Box light housing
        const boxGeo = new THREE.BoxGeometry(1.0, 2.6, 1.0)
        const box = new THREE.Mesh(boxGeo, poleMat)
        box.position.set(-4.5, 11, 0)
        tlGroup.add(box)

        const boxOutline = new THREE.Mesh(
          new THREE.BoxGeometry(1.16, 2.76, 1.16),
          outlineMat
        )
        boxOutline.position.copy(box.position)
        tlGroup.add(boxOutline)

        // Light Lenses (Facing road direction, say positive Z)
        const lensGeo = new THREE.PlaneGeometry(0.45, 0.45)

        const redLens = new THREE.Mesh(lensGeo, this.redMat)
        redLens.position.set(-4.5, 11.8, 0.51)
        tlGroup.add(redLens)

        const yellowLens = new THREE.Mesh(lensGeo, this.yellowMat)
        yellowLens.position.set(-4.5, 11.0, 0.51)
        tlGroup.add(yellowLens)

        const greenLens = new THREE.Mesh(lensGeo, this.greenMat)
        greenLens.position.set(-4.5, 10.2, 0.51)
        tlGroup.add(greenLens)

        // Position northeast of intersection
        tlGroup.position.set(ix + 12, 0.25, iz - 12)
        this.scene.add(tlGroup)
      }
    }
  }

  private createCars(): void {
    const colors = [
      0xE63946, // Spidey crimson
      0x457B9D, // Steel blue
      0xE9C46A, // Taxi yellow
      0x2A9D8F, // Turquoise
      0x7209B7, // Comic purple
      0xF72585, // Vibrant magenta
      0xFFB703, // Bright orange
      0x52B788  // Lime green
    ]

    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    // Spawn 16 moving cars on different lanes
    for (let c = 0; c < 16; c++) {
      const isHorizontal = Math.random() > 0.5
      const roadIndex = Math.floor(randomRange(-4, 5)) // -4 to 4
      const roadCenter = roadIndex * 100
      
      const goPositive = Math.random() > 0.5
      const speed = randomRange(25, 45)
      
      const carGroup = new THREE.Group()
      const color = colors[c % colors.length]

      // Car Body Toon
      const bodyMat = new THREE.MeshToonMaterial({
        color,
        gradientMap: this.ramp
      })
      const bodyGeo = new THREE.BoxGeometry(2.6, 1.1, 5.0)
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.position.y = 0.65
      body.castShadow = true
      carGroup.add(body)

      // Body outline
      const bodyOutline = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 1.25, 5.15),
        outlineMat
      )
      bodyOutline.position.copy(body.position)
      carGroup.add(bodyOutline)

      // Car Cabin Toon
      const cabinGeo = new THREE.BoxGeometry(2.3, 0.8, 2.6)
      const cabin = new THREE.Mesh(cabinGeo, bodyMat)
      cabin.position.set(0, 1.5, -0.3)
      carGroup.add(cabin)

      // Cabin outline
      const cabinOutline = new THREE.Mesh(
        new THREE.BoxGeometry(2.46, 0.95, 2.76),
        outlineMat
      )
      cabinOutline.position.copy(cabin.position)
      carGroup.add(cabinOutline)

      // Headlights (glowing yellow)
      const headGeo = new THREE.BoxGeometry(0.4, 0.3, 0.2)
      const headMat = new THREE.MeshBasicMaterial({ color: 0xFFFF88 })
      const hlLeft = new THREE.Mesh(headGeo, headMat)
      hlLeft.position.set(-0.9, 0.6, 2.51)
      carGroup.add(hlLeft)

      const hlRight = new THREE.Mesh(headGeo, headMat)
      hlRight.position.set(0.9, 0.6, 2.51)
      carGroup.add(hlRight)

      // Taillights (glowing red)
      const tailGeo = new THREE.BoxGeometry(0.4, 0.2, 0.2)
      const tailMat = new THREE.MeshBasicMaterial({ color: 0xFF2222 })
      const tlLeft = new THREE.Mesh(tailGeo, tailMat)
      tlLeft.position.set(-0.9, 0.7, -2.51)
      carGroup.add(tlLeft)

      const tlRight = new THREE.Mesh(tailGeo, tailMat)
      tlRight.position.set(0.9, 0.7, -2.51)
      carGroup.add(tlRight)

      // Initial position along the road
      const startPos = randomRange(-800, 800)
      
      let dir: THREE.Vector3
      let axis: 'x' | 'z'
      let fixedCoord: number

      if (isHorizontal) {
        axis = 'x'
        // Eastbound (lane Z + 4) or Westbound (lane Z - 4)
        fixedCoord = roadCenter + (goPositive ? 4 : -4)
        dir = new THREE.Vector3(goPositive ? 1 : -1, 0, 0)
        carGroup.position.set(startPos, 0.25, fixedCoord)
      } else {
        axis = 'z'
        // Northbound (lane X + 4) or Southbound (lane X - 4)
        fixedCoord = roadCenter + (goPositive ? 4 : -4)
        dir = new THREE.Vector3(0, 0, goPositive ? 1 : -1)
        carGroup.position.set(fixedCoord, 0.25, startPos)
      }

      // Rotate car mesh to match direction
      carGroup.rotation.y = Math.atan2(dir.x, dir.z)
      
      this.scene.add(carGroup)

      this.cars.push({
        group: carGroup,
        direction: dir,
        speed,
        axis,
        fixedCoord
      })
    }
  }

  update(delta: number): void {
    // 1. Update Traffic Lights (Green -> Yellow -> Red cycle)
    this.trafficTimer += delta
    const cycle = this.trafficTimer % 6
    if (cycle < 2.8) {
      // Green
      this.redMat.color.setHex(0x440000)
      this.yellowMat.color.setHex(0x444400)
      this.greenMat.color.setHex(0x00FF22)
    } else if (cycle < 3.8) {
      // Yellow
      this.redMat.color.setHex(0x440000)
      this.yellowMat.color.setHex(0xFFDD00)
      this.greenMat.color.setHex(0x004400)
    } else {
      // Red
      this.redMat.color.setHex(0xFF0033)
      this.yellowMat.color.setHex(0x444400)
      this.greenMat.color.setHex(0x004400)
    }

    // 2. Update Moving Cars
    this.cars.forEach(car => {
      const step = car.direction.clone().multiplyScalar(car.speed * delta)
      car.group.position.add(step)

      // Wrap around grid boundaries (-850 to 850)
      if (car.axis === 'x') {
        if (car.direction.x > 0 && car.group.position.x > 850) {
          car.group.position.x = -850
        } else if (car.direction.x < 0 && car.group.position.x < -850) {
          car.group.position.x = 850
        }
      } else {
        if (car.direction.z > 0 && car.group.position.z > 850) {
          car.group.position.z = -850
        } else if (car.direction.z < 0 && car.group.position.z < -850) {
          car.group.position.z = 850
        }
      }
    })
  }

  private createBenches(): void {
    const woodMat = new THREE.MeshToonMaterial({
      color: 0x8A5A36,
      gradientMap: this.ramp
    })
    const metalMat = new THREE.MeshToonMaterial({
      color: 0x333333,
      gradientMap: this.ramp
    })
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    const positions: [number, number, number][] = []
    for (let i = -3; i <= 3; i++) {
      for (let j = -5; j <= 5; j++) {
        if (i === 0 && j === 0) continue
        positions.push([i * 100 + 11.2, j * 40 + 10, -Math.PI / 2])
        positions.push([i * 100 - 11.2, j * 40 - 10, Math.PI / 2])
      }
    }

    positions.forEach(([x, z, rotY]) => {
      const benchGroup = new THREE.Group()

      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.8), woodMat)
      seat.position.y = 0.06
      seat.castShadow = true
      benchGroup.add(seat)

      const seatOutline = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.2, 0.92), outlineMat)
      seatOutline.position.copy(seat.position)
      benchGroup.add(seatOutline)

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 0.12), woodMat)
      back.position.set(0, 0.45, -0.38)
      back.rotation.x = -0.15
      back.castShadow = true
      benchGroup.add(back)

      const backOutline = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.7, 0.22), outlineMat)
      backOutline.position.copy(back.position)
      backOutline.rotation.copy(back.rotation)
      benchGroup.add(backOutline)

      const legGeo = new THREE.BoxGeometry(0.18, 0.4, 0.8)
      const legL = new THREE.Mesh(legGeo, metalMat)
      legL.position.set(-0.9, -0.15, -0.05)
      benchGroup.add(legL)

      const legR = new THREE.Mesh(legGeo, metalMat)
      legR.position.set(0.9, -0.15, -0.05)
      benchGroup.add(legR)

      benchGroup.position.set(x, 0.45, z)
      benchGroup.rotation.y = rotY
      this.scene.add(benchGroup)
    })
  }

  private createNewsstands(): void {
    const bodyMat = new THREE.MeshToonMaterial({
      color: 0x1E4D2B,
      gradientMap: this.ramp
    })
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xEEEEEE })
    const woodMat = new THREE.MeshToonMaterial({
      color: 0x8D99AE,
      gradientMap: this.ramp
    })
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    const positions: [number, number, number][] = []
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue
      positions.push([i * 100 + 12.0, 30, -Math.PI / 2])
      positions.push([i * 100 - 12.0, -50, Math.PI / 2])
    }

    positions.forEach(([x, z, rotY]) => {
      const nsGroup = new THREE.Group()

      const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.6, 2.0), bodyMat)
      body.position.y = 1.3
      body.castShadow = true
      nsGroup.add(body)

      const bodyOutline = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.75, 2.16), outlineMat)
      bodyOutline.position.copy(body.position)
      nsGroup.add(bodyOutline)

      const rack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 0.5), woodMat)
      rack.position.set(0, 1.0, 1.0)
      rack.rotation.x = 0.2
      nsGroup.add(rack)

      for (let py = 0; py < 3; py++) {
        for (let px = 0; px < 4; px++) {
          const paper = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.1), paperMat)
          paper.position.set(-0.9 + px * 0.6, 0.5 + py * 0.4, 1.25)
          paper.rotation.x = 0.2
          nsGroup.add(paper)
        }
      }

      const roof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.18, 2.4), bodyMat)
      roof.position.set(0, 2.65, 0.1)
      nsGroup.add(roof)

      const roofOutline = new THREE.Mesh(new THREE.BoxGeometry(3.76, 0.3, 2.56), outlineMat)
      roofOutline.position.copy(roof.position)
      nsGroup.add(roofOutline)

      nsGroup.position.set(x, 0.25, z)
      nsGroup.rotation.y = rotY
      this.scene.add(nsGroup)
    })
  }

  private createBuses(): void {
    const busColor = 0x0077B6
    const whiteMat = new THREE.MeshToonMaterial({
      color: 0xF8F9FA,
      gradientMap: this.ramp
    })
    const darkMat = new THREE.MeshBasicMaterial({ color: 0x111111 })
    const tireMat = new THREE.MeshBasicMaterial({ color: 0x222222 })
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide
    })

    const positions: [number, number, number][] = []
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue
      positions.push([i * 100 + 7.5, -80, 0])
      positions.push([i * 100 - 7.5, 90, Math.PI])
    }

    positions.forEach(([x, z, rotY]) => {
      const busGroup = new THREE.Group()

      const bodyMat = new THREE.MeshToonMaterial({
        color: busColor,
        gradientMap: this.ramp
      })
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 10.5), bodyMat)
      body.position.y = 1.6
      body.castShadow = true
      busGroup.add(body)

      const bodyOutline = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.96, 10.66), outlineMat)
      bodyOutline.position.copy(body.position)
      busGroup.add(bodyOutline)

      const roof = new THREE.Mesh(new THREE.BoxGeometry(3.65, 0.6, 10.55), whiteMat)
      roof.position.set(0, 2.8, 0)
      busGroup.add(roof)

      const roofOutline = new THREE.Mesh(new THREE.BoxGeometry(3.81, 0.72, 10.68), outlineMat)
      roofOutline.position.copy(roof.position)
      busGroup.add(roofOutline)

      const winGeo = new THREE.PlaneGeometry(1.4, 0.8)
      for (let s = -2; s <= 2; s++) {
        const winL = new THREE.Mesh(winGeo, darkMat)
        winL.position.set(-1.83, 1.9, s * 1.8)
        winL.rotation.y = -Math.PI / 2
        busGroup.add(winL)

        const winR = new THREE.Mesh(winGeo, darkMat)
        winR.position.set(1.83, 1.9, s * 1.8)
        winR.rotation.y = Math.PI / 2
        busGroup.add(winR)
      }

      const shield = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.1), darkMat)
      shield.position.set(0, 1.95, 5.26)
      busGroup.add(shield)

      const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.6, 8)
      wheelGeo.rotateZ(Math.PI / 2)

      const wheels = [
        [-1.6, 0.65, 3.2], [1.6, 0.65, 3.2],
        [-1.6, 0.65, -3.2], [1.6, 0.65, -3.2]
      ]
      wheels.forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, tireMat)
        wheel.position.set(wx, wy, wz)
        busGroup.add(wheel)
      })

      busGroup.position.set(x, 0.25, z)
      busGroup.rotation.y = rotY
      this.scene.add(busGroup)
    })
  }
}
