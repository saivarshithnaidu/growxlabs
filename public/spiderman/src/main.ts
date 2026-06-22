import { Game } from './Game'

const canvas = document.getElementById(
  'game-canvas') as HTMLCanvasElement

const game = new Game(canvas)

const titleScreen = document.getElementById(
  'title-screen')!

const startGame = () => {
  titleScreen.style.display = 'none'
  game.start()
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && 
      titleScreen.style.display !== 'none') {
    startGame()
  }
})

titleScreen.addEventListener('click', startGame)
titleScreen.addEventListener('touchend', startGame)

window.addEventListener('resize', () => {
  game.onResize()
})
