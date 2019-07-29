import * as PIXI from 'pixi.js'
import _ from 'lodash'
import './css/index.scss'
import Trash from './img/trash.png'

function component () {
  const element = document.createElement('div')
  element.innerHTML = _.join(['hello', 'webpack'], ' ')

  return element
}

document.body.appendChild(component())

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
