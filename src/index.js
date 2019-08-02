import join from 'lodash/join'
import './css/index.scss'
import * as Test from './scripts/test'
import * as PIXISTART from './scripts/pixi-starter'
const _ = { join }

process.env.NODE_ENV === 'production' ? console.log('in production') : console.log('in development')

function component () {
  const element = document.createElement('div')
  element.innerHTML = _.join(['hello', 'webpack'], ' ')

  return element
}

Test.test()

document.body.appendChild(component())

PIXISTART.pixelRun()
