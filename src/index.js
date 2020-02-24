import './css/index.scss'
// import * as Test from './scripts/test'
// import * as PIXISTART from './scripts/pixi-starter'
// import * as BABYLONSTART from './scripts/babylon-starter'
// import * as tfex from './scripts/tfex'
// import Three2d from './scripts/Three2d'
import Three2d2 from './scripts/Three2d2'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./src-sw.js').then(registration => {
      console.log('SW Registered: ', registration)
    }).catch(registrationError => {
      console.log('Registration Error: ', registrationError)
    })
  })
}

// function component () {
//   const element = document.createElement('div')
//   element.innerHTML = _.join(['hello', 'webpack'], ' ')

//   return element
// }

// Test.test()

// document.body.appendChild(component())

// PIXISTART.pixelRun()

// BABYLONSTART.babylonRunner()

// tfex.runTF()
// let t2d = new Three2d()
document.addEventListener('DOMContentLoaded', new Three2d2())

const circularCollision = (x1, y1, x2, y2, r1, r2) => {
  let d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  let rr = r1 + r2
  console.log(d, rr)
  return (d < rr)
}

console.log(circularCollision(1, 1, 3, 2, 1, 1))
