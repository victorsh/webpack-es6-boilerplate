import TempImg from '../img/trash.png'
import * as PIXI from 'pixi.js'

export const pixelRun = () => {
  const app = new PIXI.Application()
  document.body.appendChild(app.view)
  app.loader.add('trash', TempImg).load((loader, resources) => {
    const tempObject = new PIXI.Sprite(resources.trash.texture)

    tempObject.x = app.renderer.width / 2
    tempObject.y = app.renderer.height / 2

    tempObject.anchor.x = 0.5
    tempObject.anchor.y = 0.5

    app.stage.addChild(tempObject)

    app.ticker.add(() => {
      tempObject.rotation += 0.01
    })
  })

  const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', resize)

  resize()
}
