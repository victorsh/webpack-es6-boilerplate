import Trash from '../img/trash.png'
import * as PIXI from 'pixi.js'

export const pixelRun = () => {
  const trashImg = document.createElement('img')
  trashImg.src = Trash

  // document.body.appendChild(trashImg);

  const app = new PIXI.Application()
  document.body.appendChild(app.view)
  app.loader.add('trash', Trash).load((loader, resources) => {
    const trash = new PIXI.Sprite(resources.trash.texture)

    trash.x = app.renderer.width / 2
    trash.y = app.renderer.height / 2

    trash.anchor.x = 0.5
    trash.anchor.y = 0.5

    app.stage.addChild(trash)

    app.ticker.add(() => {
      trash.rotation += 0.01
    })
  })
}
