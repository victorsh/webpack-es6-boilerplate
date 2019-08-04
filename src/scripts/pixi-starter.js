import TempImg from '../img/trash.png'
import * as PIXI from 'pixi.js'
import * as STATS from 'stats-js'

let left = false
let up = false
let right = false
let down = false
/* eslint-disable */
let speed = 3
/* esling-enable */

export const pixelRun = () => {
  const stats = new STATS()
  stats.showPanel(1)
  document.body.appendChild(stats.dom)

  const app = new PIXI.Application()
  document.body.appendChild(app.view)
  app.loader.add('trash', TempImg).load((loader, resources) => {
    const tempObject = new PIXI.Sprite(resources.trash.texture)

    tempObject.x = app.renderer.width / 2
    tempObject.y = app.renderer.height / 2

    tempObject.anchor.x = 0.5
    tempObject.anchor.y = 0.5

    app.stage.addChild(tempObject)

    app.ticker.add((delta) => {
      stats.begin()
      tempObject.rotation += 0.01 * delta
      updateMove(tempObject, delta)
      stats.end()
    })
  })

  const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', resize)

  resize()

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) { // left
      left = true
    }
    if (e.keyCode === 38) { // up
      up = true
    }
    if (e.keyCode === 39) { // right
      right = true
    }
    if (e.keyCode === 40) { // down
      down = true
    }
  })

  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 37) { // left
      left = false
    }
    if (e.keyCode === 38) { // up
      up = false
    }
    if (e.keyCode === 39) { // right
      right = false
    }
    if (e.keyCode === 40) { // down
      down = false
    }
  })
}

const updateMove = (tempObject, delta) => {
  if (left) {
    tempObject.x -= 1 * delta * speed
  }
  if (up) {
    tempObject.y -= 1 * delta * speed
  }
  if (right) {
    tempObject.x += 1 * delta * speed
  }
  if (down) {
    tempObject.y += 1 * delta * speed
  }
}
