import * as THREE from 'three'

export interface InputState {
  moveDir: THREE.Vector3
  jumping: boolean
  sprinting: boolean
  webHeld: boolean
  cameraDelta: THREE.Vector2
  swapHero: boolean
}

export class InputHandler {
  private keys: Set<string> = new Set()
  private cameraDelta: THREE.Vector2 = 
    new THREE.Vector2()
  private lastMouse: THREE.Vector2 = 
    new THREE.Vector2()
  private isPointerLocked: boolean = false
  private joystickDir: THREE.Vector2 = 
    new THREE.Vector2()
  private webPressed: boolean = false
  private jumpPressed: boolean = false
  private swapPressed: boolean = false
  private touchStartId: number = -1
  private isMouseDown: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.bindKeyboard()
    this.bindMouse(canvas)
    this.bindTouch()
    this.bindButtons()
  }

  isKeyPressed(code: string): boolean {
    return this.keys.has(code)
  }

  private bindKeyboard(): void {
    window.addEventListener('keydown', e => {
      this.keys.add(e.code)
      if (e.code === 'KeyC' || e.code === 'Tab') {
        this.swapPressed = true
      }
      if (e.code === 'Backquote') {
        const debugEl = document.getElementById('debug-log')
        if (debugEl) {
          debugEl.style.display = debugEl.style.display === 'none' ? 'block' : 'none'
        }
      }
      // Prevent browser default actions
      const preventedKeys = [
        'Space', 'Tab', 'KeyC', 'KeyE', 'KeyQ', 'KeyR', 'ShiftLeft', 'ShiftRight',
        'Digit1', 'Digit2', 'Digit3',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
      ]
      if (preventedKeys.includes(e.code)) {
        e.preventDefault()
      }
    })
    window.addEventListener('keyup', e => {
      this.keys.delete(e.code)
      const preventedKeys = [
        'Space', 'Tab', 'KeyC', 'KeyE', 'KeyQ', 'KeyR', 'ShiftLeft', 'ShiftRight',
        'Digit1', 'Digit2', 'Digit3',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
      ]
      if (preventedKeys.includes(e.code)) {
        e.preventDefault()
      }
    })
  }

  private bindMouse(
    canvas: HTMLCanvasElement
  ): void {
    canvas.addEventListener('click', () => {
      canvas.requestPointerLock()
    })
    document.addEventListener(
      'pointerlockchange', () => {
        this.isPointerLocked = 
          document.pointerLockElement === canvas
      })
    document.addEventListener('mousemove', e => {
      if (this.isPointerLocked) {
        this.cameraDelta.x += e.movementX * 0.003
        this.cameraDelta.y += e.movementY * 0.003
      }
    })
    // Mouse down / up events for web-slinging
    window.addEventListener('mousedown', e => {
      if (e.button === 0) { // Left click
        this.isMouseDown = true
      }
    })
    window.addEventListener('mouseup', e => {
      if (e.button === 0) { // Left click
        this.isMouseDown = false
      }
    })
  }

  private bindTouch(): void {
    const joystickZone = document
      .getElementById('joystick-zone')
    const joystickInner = document
      .getElementById('joystick-inner')
    if (!joystickZone || !joystickInner) return

    joystickZone.addEventListener(
      'touchstart', (e) => {
        e.preventDefault()
        this.touchStartId = e.touches[0].identifier
      }, { passive: false })

    joystickZone.addEventListener(
      'touchmove', (e) => {
        e.preventDefault()
        for (let i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === 
              this.touchStartId) {
            const rect = joystickZone
              .getBoundingClientRect()
            const cx = rect.left + rect.width/2
            const cy = rect.top + rect.height/2
            const dx = e.touches[i].clientX - cx
            const dy = e.touches[i].clientY - cy
            const len = Math.sqrt(
              dx*dx + dy*dy)
            const maxR = 40
            const nx = dx / Math.max(len, maxR)
            const ny = dy / Math.max(len, maxR)
            this.joystickDir.set(nx, ny)
            joystickInner.style.transform = 
              `translate(calc(-50% + ${
                nx*maxR}px), calc(-50% + ${
                ny*maxR}px))`
          }
        }
      }, { passive: false })

    joystickZone.addEventListener(
      'touchend', () => {
        this.joystickDir.set(0, 0)
        this.touchStartId = -1
        if (joystickInner) {
          joystickInner.style.transform = 
            'translate(-50%, -50%)'
        }
      })

    // Camera touch on right side
    document.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i]
        if (t.clientX > window.innerWidth * 0.5 &&
            t.identifier !== this.touchStartId) {
          this.cameraDelta.x += 
            (t.clientX - this.lastMouse.x) * 0.005
          this.cameraDelta.y += 
            (t.clientY - this.lastMouse.y) * 0.005
          this.lastMouse.set(t.clientX, t.clientY)
        }
      }
    })
  }

  private bindButtons(): void {
    const webBtn = document.getElementById('btn-web')
    const jumpBtn = document.getElementById('btn-jump')
    const switchBtn = document.getElementById('btn-switch')

    webBtn?.addEventListener('touchstart', (e) => {
      e.preventDefault()
      this.webPressed = true
    }, { passive: false })
    webBtn?.addEventListener('touchend', () => {
      this.webPressed = false
    })

    jumpBtn?.addEventListener('touchstart', (e) => {
      e.preventDefault()
      this.jumpPressed = true
    }, { passive: false })
    jumpBtn?.addEventListener('touchend', () => {
      this.jumpPressed = false
    })

    switchBtn?.addEventListener('touchstart', (e) => {
      e.preventDefault()
      this.swapPressed = true
    }, { passive: false })
    switchBtn?.addEventListener('click', () => {
      this.swapPressed = true
    })
  }

  getState(cameraYaw: number): InputState {
    const forward = new THREE.Vector3(
      Math.sin(cameraYaw), 0, Math.cos(cameraYaw))
    const right = new THREE.Vector3(
      Math.cos(cameraYaw), 0, -Math.sin(cameraYaw))

    const moveDir = new THREE.Vector3()

    // Keyboard
    if (this.keys.has('KeyW') || 
        this.keys.has('ArrowUp'))
      moveDir.sub(forward)
    if (this.keys.has('KeyS') || 
        this.keys.has('ArrowDown'))
      moveDir.add(forward)
    if (this.keys.has('KeyA') || 
        this.keys.has('ArrowLeft'))
      moveDir.sub(right)
    if (this.keys.has('KeyD') || 
        this.keys.has('ArrowRight'))
      moveDir.add(right)

    // Joystick
    if (this.joystickDir.length() > 0.1) {
      moveDir.add(
        forward.clone().multiplyScalar(
          -this.joystickDir.y))
      moveDir.add(
        right.clone().multiplyScalar(
          this.joystickDir.x))
    }

    if (moveDir.length() > 0) moveDir.normalize()

    const cameraDelta = this.cameraDelta.clone()
    this.cameraDelta.set(0, 0)

    const swapHero = this.swapPressed
    this.swapPressed = false

    return {
      moveDir,
      jumping: this.keys.has('Space') || 
               this.jumpPressed,
      sprinting: this.keys.has('ShiftLeft') || 
                 this.keys.has('ShiftRight'),
      webHeld: this.keys.has('Space') || 
               this.isMouseDown || 
               this.webPressed,
      cameraDelta,
      swapHero
    }
  }
}
