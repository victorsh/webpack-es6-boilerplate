import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

export const runTF = async () => {
  document.addEventListener('DOMContentLoaded', run)
}

const run = async () => {
  const data = await getData()
  const values = data.map(d => ({
    x: d.horsepower,
    y: d.mpg
  }))

  tfvis.render.scatterplot(
    { name: 'Horsepower v MPG' },
    { values },
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  )

  const model = createModel()
  tfvis.show.modelSummary({ name: 'Model Summary' }, model)
}

const getData = async () => {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
  const carsData = await carsDataReq.json()
  const cleaned = carsData.map(car => ({
    mpg: car.Miles_per_Gallon,
    horsepower: car.Horsepower
  })).filter(car => (car.mpg != null && car.horsepower != null))

  return cleaned
}

const createModel = () => {
  const model = tf.sequential()
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }))
  model.add(tf.layers.dense({ units: 1, useBias: true }))

  return model
}

const convertToTensor = data => {
  return tf.tidy(() => {
    tf.util.shuffle(data)

    const inputs = data.map(d => d.horsepower)
    const labels = data.map(d => d.mpg)

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])

    const inputMax = inputTensor.max()
    const inputMin = inputTensor.min()
    const labelMax = labelTensor.max()
    const labelMin = labelTensor.min()

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin
    }
  })
}
