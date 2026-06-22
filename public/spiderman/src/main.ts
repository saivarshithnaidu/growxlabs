import { Game } from './Game'

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const game = new Game(canvas)

const titleScreen = document.getElementById('title-screen')!
const btnStart = document.getElementById('btn-start')!

let audioStarted = false
const startMenuAudio = () => {
  if (audioStarted) return
  audioStarted = true
  game.startTitleAudio()
  
  // Clean up gesture listeners
  document.removeEventListener('click', startMenuAudio)
  document.removeEventListener('keydown', startMenuAudio)
  document.removeEventListener('touchstart', startMenuAudio)
}

// Bind gesture listeners for Web Audio initialization
document.addEventListener('click', startMenuAudio)
document.addEventListener('keydown', startMenuAudio)
document.addEventListener('touchstart', startMenuAudio)

const triggerStart = () => {
  // Resume context
  startMenuAudio()
  
  // Trigger 3D camera fly-through transition
  game.triggerStartTransition()
  
  // Fade out title screen menu smoothly
  titleScreen.style.opacity = '0'
  titleScreen.style.pointerEvents = 'none'
  
  // Remove overlay from display after fade completes
  setTimeout(() => {
    titleScreen.style.display = 'none'
  }, 1200)
}

btnStart.addEventListener('click', (e) => {
  e.stopPropagation()
  triggerStart()
})

document.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && titleScreen.style.display !== 'none') {
    triggerStart()
  }
})

window.addEventListener('resize', () => {
  game.onResize()
})
