import join from 'lodash/join'
import './css/index.scss'
import * as Test from './scripts/test'
import * as PIXISTART from './scripts/pixi-starter'
import * as TF from '@tensorflow/tfjs'
import * as TFVIS from '@tensorflow/tfjs-vis'
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

// const getData = async () => {
//   const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
//   const carsData = await carsDataReq.json()
//   const cleaned = carsData.map(car => ({
//     mpg: car.Miles_per_Gallon,
//     horsepower: car.Horsepower
//   }))
//     .filter(car => (car.mpg != null && car.horsepower != null))
//   return cleaned
// }

// const run = async () => {
//   // Load and plot the original input data that we are going to train on.
//   const data = await getData()
//   const values = data.map(d => ({
//     x: d.horsepower,
//     y: d.mpg
//   }))

//   TFVIS.render.scatterplot(
//     { name: 'Horsepower v MPG' },
//     { values },
//     {
//       xLabel: 'Horsepower',
//       yLabel: 'MPG',
//       height: 300
//     }
//   )

//   // More code will be added below
// }

// document.addEventListener('DOMContentLoaded', run)

// const createModel = () => {
//   // Create a sequential model
//   const model = TF.sequential()

//   // Add a single hidden layer
//   model.add(TF.layers.dense({ inputShape: [1], units: 1, useBias: true }))

//   // Add an output layer
//   model.add(TF.layers.dense({ units: 1, useBias: true }))

//   return model
// }
