import './css/index.scss'
// import * as Test from './scripts/test'
// import * as PIXISTART from './scripts/pixi-starter'
// import * as BABYLONSTART from './scripts/babylon-starter'
// import * as tfex from './scripts/tfex'
// import Three2d from './scripts/Three2d'
import Three2d2 from './scripts/three2d/Three2d2'
import io from 'socket.io-client'

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

// Test.test()

// document.body.appendChild(component())

// PIXISTART.pixelRun()

// BABYLONSTART.babylonRunner()

// tfex.runTF()
// let t2d = new Three2d()

let ioon = io('http://localhost:9000')
ioon.on('sup', data => console.log(data))

document.addEventListener('DOMContentLoaded', new Three2d2())
