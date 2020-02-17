import './css/index.scss'
// import * as Test from './scripts/test'
// import * as PIXISTART from './scripts/pixi-starter'
// import * as BABYLONSTART from './scripts/babylon-starter'
import * as tfex from './scripts/tfex'

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

tfex.runTF()
