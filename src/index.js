import './css/index.scss'
// import io from 'socket.io-client'

// import * as Test from './scripts/test'
// import * as PIXISTART from './scripts/pixi-starter'
// import * as BABYLONSTART from './scripts/babylon-starter'

// import * as tfex from './scripts/tensorflow/tfex-mpg'
// import * as tfex from './script/tensorflow/tfex-mem-leak'

import Three2d2 from './scripts/three2d/Three2d2'

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('./sw.js').then(registration => {
//       console.log('SW Registered: ', registration)
//     }).catch(registrationError => {
//       console.log('Registration Error: ', registrationError)
//     })
//   })
// }

// function component () {
//   const element = document.createElement('div')
//   element.innerHTML = _.join(['hello', 'webpack'], ' ')

//   return element
// }
// document.body.appendChild(component())

// let ioon = io('http://localhost:9000')
// ioon.on('sup', data => console.log(data))

// Test.test()
// PIXISTART.pixelRun()
// BABYLONSTART.babylonRunner()
// tfex.runTF()

document.addEventListener('DOMContentLoaded', new Three2d2())
