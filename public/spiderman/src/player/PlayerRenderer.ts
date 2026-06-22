import * as THREE from 'three'
import { createToonRamp, clamp } from '../utils/MathUtils'
import { PlayerState } from './PlayerPhysics'

export class PlayerRenderer {
  private group: THREE.Group
  private spideyGroup: THREE.Group
  private hulkGroup: THREE.Group
  private ramp = createToonRamp()

  // Spidey Skeleton Joints
  private spideyPelvis!: THREE.Group
  private spideyTorso!: THREE.Mesh
  private spideyChest!: THREE.Mesh
  private spideyHead!: THREE.Mesh

  private spideyLeftShoulder!: THREE.Group
  private spideyLeftForearm!: THREE.Group
  private spideyLeftHand!: THREE.Mesh
  private spideyRightShoulder!: THREE.Group
  private spideyRightForearm!: THREE.Group
  private spideyRightHand!: THREE.Mesh

  private spideyLeftHip!: THREE.Group
  private spideyLeftCalf!: THREE.Group
  private spideyLeftFoot!: THREE.Mesh
  private spideyRightHip!: THREE.Group
  private spideyRightCalf!: THREE.Group
  private spideyRightFoot!: THREE.Mesh

  // Hulk Skeleton Joints
  private hulkPelvis!: THREE.Group
  private hulkTorso!: THREE.Mesh
  private hulkChest!: THREE.Mesh
  private hulkHead!: THREE.Mesh

  private hulkLeftShoulder!: THREE.Group
  private hulkLeftForearm!: THREE.Group
  private hulkLeftHand!: THREE.Mesh
  private hulkRightShoulder!: THREE.Group
  private hulkRightForearm!: THREE.Group
  private hulkRightHand!: THREE.Mesh

  private hulkLeftHip!: THREE.Group
  private hulkLeftCalf!: THREE.Group
  private hulkLeftFoot!: THREE.Mesh
  private hulkRightHip!: THREE.Group
  private hulkRightCalf!: THREE.Group
  private hulkRightFoot!: THREE.Mesh

  // 3D Web Line Mesh
  private webCylinder: THREE.Mesh

  private time: number = 0
  private currentHero: 'SPIDERMAN' | 'HULK' = 'SPIDERMAN'

  // Mid-air tricks properties
  private activeTrick: 'front_flip' | 'back_flip' | 'barrel_roll' | null = null
  private trickTime: number = 0
  private readonly TRICK_DURATION = 0.65

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group()
    
    this.spideyGroup = new THREE.Group()
    this.hulkGroup = new THREE.Group()
    
    this.buildSpiderMan()
    this.buildHulk()
    
    this.group.add(this.spideyGroup)
    this.group.add(this.hulkGroup)
    
    // Default to Spidey
    this.setHero('SPIDERMAN')
    scene.add(this.group)

    // Build 3D Web Line cylinder
    const webMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const webGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 6)
    this.webCylinder = new THREE.Mesh(webGeo, webMat)
    this.webCylinder.visible = false
    scene.add(this.webCylinder)
  }

  setHero(type: 'SPIDERMAN' | 'HULK'): void {
    this.currentHero = type
    this.spideyGroup.visible = type === 'SPIDERMAN'
    this.hulkGroup.visible = type === 'HULK'
  }

  triggerTrick(type: 'front_flip' | 'back_flip' | 'barrel_roll'): void {
    if (this.activeTrick) return // Don't interrupt ongoing trick
    this.activeTrick = type
    this.trickTime = 0
  }

  getActiveTrick(): 'front_flip' | 'back_flip' | 'barrel_roll' | null {
    return this.activeTrick
  }

  getLeftHandWorldPos(): THREE.Vector3 {
    const pos = new THREE.Vector3()
    if (this.currentHero === 'SPIDERMAN') {
      this.spideyLeftHand.getWorldPosition(pos)
    } else {
      this.hulkLeftHand.getWorldPosition(pos)
    }
    return pos
  }

  getRightHandWorldPos(): THREE.Vector3 {
    const pos = new THREE.Vector3()
    if (this.currentHero === 'SPIDERMAN') {
      this.spideyRightHand.getWorldPosition(pos)
    } else {
      this.hulkRightHand.getWorldPosition(pos)
    }
    return pos
  }

  private buildSpiderMan(): void {
    const redMat = new THREE.MeshToonMaterial({ color: 0xD90429, gradientMap: this.ramp }) // Spidey red
    const blueMat = new THREE.MeshToonMaterial({ color: 0x1D3557, gradientMap: this.ramp }) // Midnight blue
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x111111 })
    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })

    const outlineOffset = 0.08

    // Root Pelvis
    this.spideyPelvis = new THREE.Group()
    this.spideyGroup.add(this.spideyPelvis)

    // Torso (Pelvis to waist/belt)
    this.spideyTorso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.6), redMat)
    this.spideyTorso.position.y = 1.6
    this.spideyPelvis.add(this.spideyTorso)

    const torsoOutline = new THREE.Mesh(
      new THREE.BoxGeometry(0.7 + outlineOffset, 0.8 + outlineOffset, 0.6 + outlineOffset),
      outlineMat
    )
    this.spideyTorso.add(torsoOutline)

    // Chest
    this.spideyChest = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 0.7), redMat)
    this.spideyChest.position.y = 0.8 // relative to torso
    this.spideyTorso.add(this.spideyChest)

    const chestOutline = new THREE.Mesh(
      new THREE.BoxGeometry(0.85 + outlineOffset, 0.9 + outlineOffset, 0.7 + outlineOffset),
      outlineMat
    )
    this.spideyChest.add(chestOutline)

    // Head
    this.spideyHead = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 12), redMat)
    this.spideyHead.position.y = 0.8 // relative to chest
    this.spideyChest.add(this.spideyHead)

    const headOutline = new THREE.Mesh(
      new THREE.SphereGeometry(0.48 + outlineOffset, 12, 12),
      outlineMat
    )
    this.spideyHead.add(headOutline)

    // Left Arm (Shoulder -> Forearm -> Hand)
    this.spideyLeftShoulder = new THREE.Group()
    this.spideyLeftShoulder.position.set(-0.55, 0.35, 0)
    this.spideyChest.add(this.spideyLeftShoulder)

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8), redMat)
    leftUpperArm.position.y = -0.4
    this.spideyLeftShoulder.add(leftUpperArm)

    this.spideyLeftForearm = new THREE.Group()
    this.spideyLeftForearm.position.y = -0.8
    this.spideyLeftShoulder.add(this.spideyLeftForearm)

    const leftForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.7, 8), redMat)
    leftForearmMesh.position.y = -0.35
    this.spideyLeftForearm.add(leftForearmMesh)

    this.spideyLeftHand = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), redMat)
    this.spideyLeftHand.position.y = -0.75
    this.spideyLeftForearm.add(this.spideyLeftHand)

    // Right Arm (Shoulder -> Forearm -> Hand)
    this.spideyRightShoulder = new THREE.Group()
    this.spideyRightShoulder.position.set(0.55, 0.35, 0)
    this.spideyChest.add(this.spideyRightShoulder)

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8), redMat)
    rightUpperArm.position.y = -0.4
    this.spideyRightShoulder.add(rightUpperArm)

    this.spideyRightForearm = new THREE.Group()
    this.spideyRightForearm.position.y = -0.8
    this.spideyRightShoulder.add(this.spideyRightForearm)

    const rightForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.7, 8), redMat)
    rightForearmMesh.position.y = -0.35
    this.spideyRightForearm.add(rightForearmMesh)

    this.spideyRightHand = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), redMat)
    this.spideyRightHand.position.y = -0.75
    this.spideyRightForearm.add(this.spideyRightHand)

    // Left Leg (Hip -> Thigh -> Calf -> Foot)
    this.spideyLeftHip = new THREE.Group()
    this.spideyLeftHip.position.set(-0.25, -0.4, 0)
    this.spideyPelvis.add(this.spideyLeftHip)

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.9, 8), blueMat)
    leftThigh.position.y = -0.45
    this.spideyLeftHip.add(leftThigh)

    this.spideyLeftCalf = new THREE.Group()
    this.spideyLeftCalf.position.y = -0.9
    this.spideyLeftHip.add(this.spideyLeftCalf)

    const leftCalfMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.8, 8), redMat)
    leftCalfMesh.position.y = -0.4
    this.spideyLeftCalf.add(leftCalfMesh)

    this.spideyLeftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.65), redMat)
    this.spideyLeftFoot.position.set(0, -0.9, 0.12)
    this.spideyLeftCalf.add(this.spideyLeftFoot)

    // Right Leg (Hip -> Thigh -> Calf -> Foot)
    this.spideyRightHip = new THREE.Group()
    this.spideyRightHip.position.set(0.25, -0.4, 0)
    this.spideyPelvis.add(this.spideyRightHip)

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.9, 8), blueMat)
    rightThigh.position.y = -0.45
    this.spideyRightHip.add(rightThigh)

    this.spideyRightCalf = new THREE.Group()
    this.spideyRightCalf.position.y = -0.9
    this.spideyRightHip.add(this.spideyRightCalf)

    const rightCalfMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.8, 8), redMat)
    rightCalfMesh.position.y = -0.4
    this.spideyRightCalf.add(rightCalfMesh)

    this.spideyRightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.65), redMat)
    this.spideyRightFoot.position.set(0, -0.9, 0.12)
    this.spideyRightCalf.add(this.spideyRightFoot)

    // Detail: Blue Ribs on Chest sides
    const ribGeo = new THREE.BoxGeometry(0.2, 0.8, 0.65)
    const leftRib = new THREE.Mesh(ribGeo, blueMat)
    leftRib.position.set(-0.5, 0, 0.02)
    this.spideyChest.add(leftRib)

    const rightRib = new THREE.Mesh(ribGeo, blueMat)
    rightRib.position.set(0.5, 0, 0.02)
    this.spideyChest.add(rightRib)

    // Detail: Pectoral Blocks
    const pecGeo = new THREE.BoxGeometry(0.35, 0.35, 0.1)
    const leftPec = new THREE.Mesh(pecGeo, redMat)
    leftPec.position.set(-0.2, 0.15, 0.36)
    this.spideyChest.add(leftPec)

    const rightPec = new THREE.Mesh(pecGeo, redMat)
    rightPec.position.set(0.2, 0.15, 0.36)
    this.spideyChest.add(rightPec)

    // Detail: sloped white eyes with thick black rims
    const eyeBackGeo = new THREE.BoxGeometry(0.2, 0.2, 0.05)
    const eyeLensGeo = new THREE.BoxGeometry(0.14, 0.14, 0.06)

    const eyeL = new THREE.Mesh(eyeBackGeo, blackMat)
    eyeL.position.set(-0.18, 0.08, 0.42)
    eyeL.rotation.set(-0.1, -0.2, -0.1)
    this.spideyHead.add(eyeL)

    const lensL = new THREE.Mesh(eyeLensGeo, whiteMat)
    lensL.position.copy(eyeL.position)
    lensL.position.z += 0.01
    lensL.rotation.copy(eyeL.rotation)
    this.spideyHead.add(lensL)

    const eyeR = new THREE.Mesh(eyeBackGeo, blackMat)
    eyeR.position.set(0.18, 0.08, 0.42)
    eyeR.rotation.set(-0.1, 0.2, 0.1)
    this.spideyHead.add(eyeR)

    const lensR = new THREE.Mesh(eyeLensGeo, whiteMat)
    lensR.position.copy(eyeR.position)
    lensR.position.z += 0.01
    lensR.rotation.copy(eyeR.rotation)
    this.spideyHead.add(lensR)

    // Detail: 3D Chest Spider emblem
    const logoBody = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.28, 0.05), blackMat)
    logoBody.position.set(0, 0.1, 0.43)
    this.spideyChest.add(logoBody)
  }

  private buildHulk(): void {
    const greenMat = new THREE.MeshToonMaterial({ color: 0x2E8B57, gradientMap: this.ramp }) // Forest green
    const purpleMat = new THREE.MeshToonMaterial({ color: 0x7209B7, gradientMap: this.ramp }) // Purple pants
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x111111 })
    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })

    const outlineOffset = 0.14

    // Root Pelvis
    this.hulkPelvis = new THREE.Group()
    this.hulkGroup.add(this.hulkPelvis)

    // Torso (waist/lower abs)
    this.hulkTorso = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 1.1), purpleMat)
    this.hulkTorso.position.y = 1.3
    this.hulkPelvis.add(this.hulkTorso)

    const torsoOutline = new THREE.Mesh(
      new THREE.BoxGeometry(1.6 + outlineOffset, 1.1 + outlineOffset, 1.1 + outlineOffset),
      outlineMat
    )
    this.hulkTorso.add(torsoOutline)

    // Chest (Massive upper body)
    this.hulkChest = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 1.7), greenMat)
    this.hulkChest.position.y = 1.1
    this.hulkTorso.add(this.hulkChest)

    const chestOutline = new THREE.Mesh(
      new THREE.BoxGeometry(2.5 + outlineOffset, 1.5 + outlineOffset, 1.7 + outlineOffset),
      outlineMat
    )
    this.hulkChest.add(chestOutline)

    // Head
    this.hulkHead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), greenMat)
    this.hulkHead.position.y = 1.05
    this.hulkChest.add(this.hulkHead)

    const headOutline = new THREE.Mesh(
      new THREE.BoxGeometry(0.8 + outlineOffset, 0.8 + outlineOffset, 0.8 + outlineOffset),
      outlineMat
    )
    this.hulkHead.add(headOutline)

    // Hair
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.9), blackMat)
    hair.position.y = 0.45
    this.hulkHead.add(hair)

    // Left Arm (Shoulder -> Forearm -> Hand)
    this.hulkLeftShoulder = new THREE.Group()
    this.hulkLeftShoulder.position.set(-1.4, 0.5, 0)
    this.hulkChest.add(this.hulkLeftShoulder)

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.2, 8), greenMat)
    leftUpperArm.position.y = -0.5
    this.hulkLeftShoulder.add(leftUpperArm)

    this.hulkLeftForearm = new THREE.Group()
    this.hulkLeftForearm.position.y = -1.0
    this.hulkLeftShoulder.add(this.hulkLeftForearm)

    const leftForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 1.0, 8), greenMat)
    leftForearmMesh.position.y = -0.5
    this.hulkLeftForearm.add(leftForearmMesh)

    this.hulkLeftHand = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), greenMat) // Giant fist
    this.hulkLeftHand.position.y = -1.1
    this.hulkLeftForearm.add(this.hulkLeftHand)

    // Right Arm (Shoulder -> Forearm -> Hand)
    this.hulkRightShoulder = new THREE.Group()
    this.hulkRightShoulder.position.set(1.4, 0.5, 0)
    this.hulkChest.add(this.hulkRightShoulder)

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.2, 8), greenMat)
    rightUpperArm.position.y = -0.5
    this.hulkRightShoulder.add(rightUpperArm)

    this.hulkRightForearm = new THREE.Group()
    this.hulkRightForearm.position.y = -1.0
    this.hulkRightShoulder.add(this.hulkRightForearm)

    const rightForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 1.0, 8), greenMat)
    rightForearmMesh.position.y = -0.5
    this.hulkRightForearm.add(rightForearmMesh)

    this.hulkRightHand = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), greenMat) // Giant fist
    this.hulkRightHand.position.y = -1.1
    this.hulkRightForearm.add(this.hulkRightHand)

    // Left Leg (Hip -> Thigh -> Calf -> Foot)
    this.hulkLeftHip = new THREE.Group()
    this.hulkLeftHip.position.set(-0.6, -0.55, 0)
    this.hulkPelvis.add(this.hulkLeftHip)

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.0, 8), purpleMat)
    leftThigh.position.y = -0.5
    this.hulkLeftHip.add(leftThigh)

    this.hulkLeftCalf = new THREE.Group()
    this.hulkLeftCalf.position.y = -0.9
    this.hulkLeftHip.add(this.hulkLeftCalf)

    const leftCalfMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.1, 8), greenMat)
    leftCalfMesh.position.y = -0.5
    this.hulkLeftCalf.add(leftCalfMesh)

    this.hulkLeftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 1.0), greenMat)
    this.hulkLeftFoot.position.set(0, -1.1, 0.25)
    this.hulkLeftCalf.add(this.hulkLeftFoot)

    // Right Leg (Hip -> Thigh -> Calf -> Foot)
    this.hulkRightHip = new THREE.Group()
    this.hulkRightHip.position.set(0.6, -0.55, 0)
    this.hulkPelvis.add(this.hulkRightHip)

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.0, 8), purpleMat)
    rightThigh.position.y = -0.5
    this.hulkRightHip.add(rightThigh)

    this.hulkRightCalf = new THREE.Group()
    this.hulkRightCalf.position.y = -0.9
    this.hulkRightHip.add(this.hulkRightCalf)

    const rightCalfMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.1, 8), greenMat)
    rightCalfMesh.position.y = -0.5
    this.hulkRightCalf.add(rightCalfMesh)

    this.hulkRightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 1.0), greenMat)
    this.hulkRightFoot.position.set(0, -1.1, 0.25)
    this.hulkRightCalf.add(this.hulkRightFoot)

    // Detail: Giant green pectoral blocks
    const pecGeo = new THREE.BoxGeometry(1.05, 0.7, 0.3)
    const leftPec = new THREE.Mesh(pecGeo, greenMat)
    leftPec.position.set(-0.55, 0.35, 0.9)
    this.hulkChest.add(leftPec)

    const rightPec = new THREE.Mesh(pecGeo, greenMat)
    rightPec.position.set(0.55, 0.35, 0.9)
    this.hulkChest.add(rightPec)

    // Detail: 3D Abs (6 pack blocks)
    const abGeo = new THREE.BoxGeometry(0.52, 0.28, 0.15)
    for (let r = 0; r < 3; r++) {
      const abL = new THREE.Mesh(abGeo, greenMat)
      abL.position.set(-0.32, -0.15 - r * 0.32, 0.58)
      this.hulkChest.add(abL)

      const abR = new THREE.Mesh(abGeo, greenMat)
      abR.position.set(0.32, -0.15 - r * 0.32, 0.58)
      this.hulkChest.add(abR)
    }
  }

  update(
    delta: number,
    velocity: THREE.Vector3,
    isSwinging: boolean,
    isWallRunning: boolean,
    anchorPoint: THREE.Vector3 | null = null,
    isWallCrawling: boolean = false,
    activeWristIsLeft: boolean = false,
    playerState: PlayerState = 'GROUNDED'
  ): void {
    this.time += delta
    const speed = velocity.length()

    // 1. Update 3D Web Line Mesh stretching between wrist hand joint and building anchor point
    if (this.currentHero === 'SPIDERMAN' && isSwinging && anchorPoint) {
      this.webCylinder.visible = true
      
      // Get the world position of the shooting hand wrist directly!
      const pStart = activeWristIsLeft ? this.getLeftHandWorldPos() : this.getRightHandWorldPos()
      const pEnd = anchorPoint.clone()
      
      const dir = pEnd.clone().sub(pStart)
      const length = dir.length()
      
      this.webCylinder.position.copy(pStart).add(dir.clone().multiplyScalar(0.5))
      this.webCylinder.scale.set(1, length, 1)
      this.webCylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    } else {
      this.webCylinder.visible = false
    }

    // 2. Animate Air Trick Rotations
    if (this.activeTrick) {
      this.trickTime += delta
      const progress = clamp(this.trickTime / this.TRICK_DURATION, 0, 1)
      const angle = progress * Math.PI * 2

      if (this.currentHero === 'SPIDERMAN') {
        if (this.activeTrick === 'front_flip') {
          this.spideyPelvis.rotation.set(angle, 0, 0)
        } else if (this.activeTrick === 'back_flip') {
          this.spideyPelvis.rotation.set(-angle, 0, 0)
        } else if (this.activeTrick === 'barrel_roll') {
          this.spideyPelvis.rotation.set(0, 0, angle)
        }
      } else {
        if (this.activeTrick === 'front_flip') {
          this.hulkPelvis.rotation.set(angle, 0, 0)
        } else if (this.activeTrick === 'back_flip') {
          this.hulkPelvis.rotation.set(-angle, 0, 0)
        } else if (this.activeTrick === 'barrel_roll') {
          this.hulkPelvis.rotation.set(0, 0, angle)
        }
      }

      if (progress >= 1.0) {
        this.activeTrick = null
        this.trickTime = 0
        this.spideyPelvis.rotation.set(0, 0, 0)
        this.hulkPelvis.rotation.set(0, 0, 0)
      }
      return // Lock normal animations during flips
    }

    // Reset root trick and dive rotations if state finishes
    this.spideyPelvis.rotation.set(0, 0, 0)
    this.hulkPelvis.rotation.set(0, 0, 0)
    this.spideyHead.rotation.set(0, 0, 0)
    this.hulkHead.rotation.set(0, 0, 0)

    // 3. Normal State Poses
    if (this.currentHero === 'SPIDERMAN') {
      // Joint Alignment (IK) for swinging
      if (isSwinging && anchorPoint) {
        // Point shooting arm directly at anchor point
        const activeShoulder = activeWristIsLeft ? this.spideyLeftShoulder : this.spideyRightShoulder
        const inactiveShoulder = activeWristIsLeft ? this.spideyRightShoulder : this.spideyLeftShoulder
        const activeForearm = activeWristIsLeft ? this.spideyLeftForearm : this.spideyRightForearm

        const shoulderPos = new THREE.Vector3()
        activeShoulder.getWorldPosition(shoulderPos)
        const localDir = anchorPoint.clone().sub(shoulderPos)
        activeShoulder.parent!.worldToLocal(localDir)
        localDir.normalize()

        // Rotate shoulder joint to point arm at anchor
        activeShoulder.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), localDir)
        activeForearm.rotation.set(0, 0, 0) // Straight arm

        // Draw inactive arm trailing back
        inactiveShoulder.rotation.set(0.6, 0, activeWristIsLeft ? -0.4 : 0.4)

        // Draw legs tucked slightly
        this.spideyLeftHip.rotation.set(0.5, 0, 0.2)
        this.spideyRightHip.rotation.set(0.5, 0, -0.2)
        this.spideyLeftCalf.rotation.set(0.3, 0, 0)
        this.spideyRightCalf.rotation.set(0.3, 0, 0)
        return
      }

      // Wall Crawling Skeletal Pose
      if (isWallCrawling) {
        const crawlSwing = Math.sin(this.time * 10)
        const isMoving = speed > 0.5

        this.spideyLeftShoulder.rotation.set(0.2 + (isMoving ? crawlSwing * 0.4 : 0), 0.3, 1.2)
        this.spideyRightShoulder.rotation.set(0.2 - (isMoving ? crawlSwing * 0.4 : 0), -0.3, -1.2)
        this.spideyLeftForearm.rotation.set(-0.4, 0, 0)
        this.spideyRightForearm.rotation.set(-0.4, 0, 0)

        this.spideyLeftHip.rotation.set(0.6 - (isMoving ? crawlSwing * 0.3 : 0), 0, 0.4)
        this.spideyRightHip.rotation.set(0.6 + (isMoving ? crawlSwing * 0.3 : 0), 0, -0.4)
        this.spideyLeftCalf.rotation.set(0.4, 0, 0)
        this.spideyRightCalf.rotation.set(0.4, 0, 0)
        return
      }

      // Wall Running Skeletal Pose
      if (isWallRunning) {
        this.spideyLeftShoulder.rotation.set(-0.5, 0, 0.4)
        this.spideyRightShoulder.rotation.set(-0.5, 0, -0.4)
        this.spideyLeftHip.rotation.set(0.8, 0, 0.3)
        this.spideyRightHip.rotation.set(0.8, 0, -0.3)
        this.spideyLeftCalf.rotation.set(0.6, 0, 0)
        this.spideyRightCalf.rotation.set(0.6, 0, 0)
        return
      }

      // Diving Pose
      if (playerState === 'DIVE') {
        this.spideyLeftShoulder.rotation.set(-2.0, 0, 0.3)
        this.spideyRightShoulder.rotation.set(-2.0, 0, -0.3)
        this.spideyLeftForearm.rotation.set(-0.5, 0, 0)
        this.spideyRightForearm.rotation.set(-0.5, 0, 0)
        this.spideyPelvis.rotation.set(1.4, 0, 0)
        this.spideyHead.rotation.set(0.6, 0, 0)
        this.spideyLeftHip.rotation.set(-0.4, 0, 0.1)
        this.spideyRightHip.rotation.set(-0.4, 0, -0.1)
        this.spideyLeftCalf.rotation.set(0.4, 0, 0)
        this.spideyRightCalf.rotation.set(0.4, 0, 0)
        return
      }

      // Airborne / Jumping / Falling Pose
      if (playerState === 'JUMPING' || playerState === 'FALLING') {
        // Arms spread out / wind resistance pose
        this.spideyLeftShoulder.rotation.set(0.4, 0, 0.8)
        this.spideyRightShoulder.rotation.set(0.4, 0, -0.8)
        this.spideyLeftForearm.rotation.set(0.2, 0, 0)
        this.spideyRightForearm.rotation.set(0.2, 0, 0)

        // Legs trailing back slightly
        this.spideyLeftHip.rotation.set(-0.35, 0, 0.1)
        this.spideyRightHip.rotation.set(-0.35, 0, -0.1)
        this.spideyLeftCalf.rotation.set(0.4, 0, 0)
        this.spideyRightCalf.rotation.set(0.4, 0, 0)
        return
      }

      // Running Cycle
      if (speed > 0.5) {
        const swing = Math.sin(this.time * 9.5)
        
        // Pelvis bounce
        this.spideyPelvis.position.y = Math.abs(Math.sin(this.time * 19)) * 0.08

        // Leg swings
        this.spideyLeftHip.rotation.x = swing * 0.6
        this.spideyRightHip.rotation.x = -swing * 0.6
        this.spideyLeftCalf.rotation.x = Math.max(swing * 0.4, 0)
        this.spideyRightCalf.rotation.x = Math.max(-swing * 0.4, 0)

        // Arm swings
        this.spideyLeftShoulder.rotation.x = -swing * 0.5
        this.spideyRightShoulder.rotation.x = swing * 0.5
        this.spideyLeftForearm.rotation.x = -Math.abs(swing) * 0.3
        this.spideyRightForearm.rotation.x = -Math.abs(swing) * 0.3

        // Reset Z/Y joint rotations
        this.spideyLeftShoulder.rotation.y = 0; this.spideyLeftShoulder.rotation.z = 0
        this.spideyRightShoulder.rotation.y = 0; this.spideyRightShoulder.rotation.z = 0
      } else {
        // Idle breathing
        const breathe = Math.sin(this.time * 2) * 0.03
        this.spideyChest.scale.set(1 + breathe, 1 + breathe, 1 + breathe)
        this.spideyHead.position.y = 0.8 + Math.sin(this.time * 2) * 0.015

        // Reset joints to zero poses
        this.spideyPelvis.position.y = 0
        this.spideyLeftShoulder.rotation.set(0.1, 0, -0.15)
        this.spideyRightShoulder.rotation.set(0.1, 0, 0.15)
        this.spideyLeftForearm.rotation.set(0, 0, 0)
        this.spideyRightForearm.rotation.set(0, 0, 0)
        this.spideyLeftHip.rotation.set(0, 0, 0)
        this.spideyRightHip.rotation.set(0, 0, 0)
        this.spideyLeftCalf.rotation.set(0, 0, 0)
        this.spideyRightCalf.rotation.set(0, 0, 0)
      }

    } else {
      // HULK pose animations
      // Diving Pose
      if (playerState === 'DIVE') {
        this.hulkLeftShoulder.rotation.set(-1.8, 0, 0.4)
        this.hulkRightShoulder.rotation.set(-1.8, 0, -0.4)
        this.hulkLeftForearm.rotation.set(-0.6, 0, 0)
        this.hulkRightForearm.rotation.set(-0.6, 0, 0)
        this.hulkPelvis.rotation.set(1.2, 0, 0)
        this.hulkHead.rotation.set(0.5, 0, 0)
        this.hulkLeftHip.rotation.set(-0.5, 0, 0.15)
        this.hulkRightHip.rotation.set(-0.5, 0, -0.15)
        this.hulkLeftCalf.rotation.set(0.5, 0, 0)
        this.hulkRightCalf.rotation.set(0.5, 0, 0)
        return
      }

      // Airborne / Leaping / Falling Pose
      if (playerState === 'JUMPING' || playerState === 'FALLING') {
        this.hulkLeftShoulder.rotation.set(0.6, 0, 0.5)
        this.hulkRightShoulder.rotation.set(0.6, 0, -0.5)
        this.hulkLeftHip.rotation.set(-0.4, 0, 0.15)
        this.hulkRightHip.rotation.set(-0.4, 0, -0.15)
        this.hulkLeftCalf.rotation.set(0.5, 0, 0)
        this.hulkRightCalf.rotation.set(0.5, 0, 0)
        return
      }

      if (speed > 0.5) {
        const swing = Math.sin(this.time * 6.5) // Slower, heavier run cycle
        const bounce = Math.abs(Math.sin(this.time * 13)) * 0.18

        this.hulkPelvis.position.y = bounce

        // Thighs/legs swinging
        this.hulkLeftHip.rotation.x = swing * 0.75
        this.hulkRightHip.rotation.x = -swing * 0.75
        this.hulkLeftCalf.rotation.x = Math.max(swing * 0.5, 0)
        this.hulkRightCalf.rotation.x = Math.max(-swing * 0.5, 0)

        // Arms swinging heavily
        this.hulkLeftShoulder.rotation.x = -swing * 0.6
        this.hulkRightShoulder.rotation.x = swing * 0.6
        this.hulkLeftForearm.rotation.x = -Math.abs(swing) * 0.4
        this.hulkRightForearm.rotation.x = -Math.abs(swing) * 0.4
      } else {
        // Idle Hulk breathing
        const breathe = Math.sin(this.time * 1.5) * 0.04
        this.hulkChest.scale.set(1 + breathe, 1 + breathe, 1 + breathe)
        this.hulkHead.position.y = 1.05 + Math.sin(this.time * 1.5) * 0.02

        // Reset joints to zero poses
        this.hulkPelvis.position.y = 0
        this.hulkLeftShoulder.rotation.set(0.1, 0, -0.2)
        this.hulkRightShoulder.rotation.set(0.1, 0, 0.2)
        this.hulkLeftForearm.rotation.set(0, 0, 0)
        this.hulkRightForearm.rotation.set(0, 0, 0)
        this.hulkLeftHip.rotation.set(0, 0, 0)
        this.hulkRightHip.rotation.set(0, 0, 0)
        this.hulkLeftCalf.rotation.set(0, 0, 0)
        this.hulkRightCalf.rotation.set(0, 0, 0)
      }
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
