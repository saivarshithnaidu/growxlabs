import * as THREE from 'three'

export class PlayerRenderer {
  private group: THREE.Group
  private head!: THREE.Mesh
  private torso!: THREE.Mesh
  private leftArm!: THREE.Mesh
  private rightArm!: THREE.Mesh
  private leftLeg!: THREE.Mesh
  private rightLeg!: THREE.Mesh
  private time: number = 0

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group()
    this.buildSpiderMan()
    scene.add(this.group)
  }

  private buildSpiderMan(): void {
    const red = new THREE.MeshLambertMaterial(
      { color: 0xCC0000 })
    const blue = new THREE.MeshLambertMaterial(
      { color: 0x1A1AFF })
    const white = new THREE.MeshLambertMaterial(
      { color: 0xFFFFFF })
    const black = new THREE.MeshLambertMaterial(
      { color: 0x111111 })

    // Head
    const headGeo = new THREE.SphereGeometry(
      0.8, 12, 12)
    this.head = new THREE.Mesh(headGeo, red)
    this.head.position.y = 3.8
    this.head.castShadow = true
    this.group.add(this.head)

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(
      0.25, 8, 8)
    const leftEye = new THREE.Mesh(eyeGeo, white)
    leftEye.position.set(-0.3, 3.95, 0.65)
    this.group.add(leftEye)
    const rightEye = new THREE.Mesh(eyeGeo, white)
    rightEye.position.set(0.3, 3.95, 0.65)
    this.group.add(rightEye)

    // Torso
    const torsoGeo = new THREE.BoxGeometry(
      1.6, 2, 0.8)
    this.torso = new THREE.Mesh(torsoGeo, red)
    this.torso.position.y = 2.3
    this.torso.castShadow = true
    this.group.add(this.torso)

    // Spider symbol
    const symbolGeo = new THREE.PlaneGeometry(
      0.8, 0.8)
    const symbol = new THREE.Mesh(symbolGeo, black)
    symbol.position.set(0, 2.4, 0.41)
    this.group.add(symbol)

    // Arms
    const armGeo = new THREE.CylinderGeometry(
      0.2, 0.2, 1.8, 8)
    this.leftArm = new THREE.Mesh(armGeo, red)
    this.leftArm.position.set(-1.1, 2.3, 0)
    this.leftArm.rotation.z = 0.3
    this.group.add(this.leftArm)

    this.rightArm = new THREE.Mesh(armGeo, red)
    this.rightArm.position.set(1.1, 2.3, 0)
    this.rightArm.rotation.z = -0.3
    this.group.add(this.rightArm)

    // Legs
    const legGeo = new THREE.CylinderGeometry(
      0.22, 0.22, 2, 8)
    this.leftLeg = new THREE.Mesh(legGeo, blue)
    this.leftLeg.position.set(-0.45, 0.3, 0)
    this.group.add(this.leftLeg)

    this.rightLeg = new THREE.Mesh(legGeo, blue)
    this.rightLeg.position.set(0.45, 0.3, 0)
    this.group.add(this.rightLeg)

    // Hands
    const handGeo = new THREE.SphereGeometry(
      0.22, 6, 6)
    const leftHand = new THREE.Mesh(handGeo, red)
    leftHand.position.set(-1.6, 1.5, 0)
    this.group.add(leftHand)
    const rightHand = new THREE.Mesh(handGeo, red)
    rightHand.position.set(1.6, 1.5, 0)
    this.group.add(rightHand)

    // Feet
    const footGeo = new THREE.BoxGeometry(
      0.5, 0.4, 0.8)
    const leftFoot = new THREE.Mesh(footGeo, blue)
    leftFoot.position.set(-0.45, -0.7, 0.1)
    this.group.add(leftFoot)
    const rightFoot = new THREE.Mesh(footGeo, blue)
    rightFoot.position.set(0.45, -0.7, 0.1)
    this.group.add(rightFoot)
  }

  update(
    delta: number,
    velocity: THREE.Vector3,
    isSwinging: boolean,
    isWallRunning: boolean
  ): void {
    this.time += delta
    const speed = velocity.length()

    // Idle breathing
    if (speed < 0.5) {
      this.torso.scale.y = 
        1 + Math.sin(this.time * 2) * 0.03
      this.head.position.y = 
        3.8 + Math.sin(this.time * 2) * 0.05
    }

    // Run animation
    if (speed > 0.5 && !isSwinging) {
      const swing = Math.sin(this.time * 8)
      this.leftLeg.rotation.x = swing * 0.5
      this.rightLeg.rotation.x = -swing * 0.5
      this.leftArm.rotation.x = -swing * 0.4
      this.rightArm.rotation.x = swing * 0.4
      this.group.rotation.x = 
        Math.min(speed * 0.01, 0.2)
    } else {
      this.leftLeg.rotation.x = 0
      this.rightLeg.rotation.x = 0
      this.leftArm.rotation.x = 0
      this.rightArm.rotation.x = 0
      this.group.rotation.x = 0
    }

    // Swing pose
    if (isSwinging) {
      this.leftArm.rotation.x = -1.2
      this.rightArm.rotation.x = -1.2
      this.leftLeg.rotation.x = 0.5
      this.rightLeg.rotation.x = 0.5
    }

    // Wall run tilt
    if (isWallRunning) {
      this.group.rotation.z = 
        Math.PI / 2 * 0.5
    } else {
      this.group.rotation.z = 0
    }
  }

  setPosition(pos: THREE.Vector3): void {
    this.group.position.copy(pos)
  }

  setRotationY(angle: number): void {
    this.group.rotation.y = angle
  }

  getGroup(): THREE.Group { return this.group }
}
