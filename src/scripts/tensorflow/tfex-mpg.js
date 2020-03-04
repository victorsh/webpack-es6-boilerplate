import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

/**
 * An example of training and predicting using a neural net and tensorflow.
 *
 * Example of Linear Regression: Tries to fit a line to trend present in the input data
 *
 * Playlist For TFJS tutorials: https://www.youtube.com/watch?v=Qt3ZABW5lD0&list=PLRqwX-V7Uu6YIeVA3dNxbR9PYj4wV31oQ
 */
export const runTF = async () => {
  document.addEventListener('DOMContentLoaded', await run())
}

// Main function
const run = async () => {
  const data = await getData()
  // Organize the data by mapping it to x and y parameters
  const values = data.map(d => ({
    x: d.horsepower,
    y: d.mpg
  }))

  tfvis.render.scatterplot(
    // Title
    { name: 'Horsepower v MPG' },
    // Data
    { values },
    // Graph Parameters
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  )

  const model = createModel()
  tfvis.show.modelSummary({ name: 'Model Summary' }, model)

  // Convert the data to a form we can use for training.
  const tensorData = convertToTensor(data)
  const { inputs, labels } = tensorData

  // Train the model
  await trainModel(model, inputs, labels)
  console.log('Done Training')

  testModel(model, data, tensorData)
}

/* ----> SUB FUNCTIONS <---- */

// Create the neural network
// This one only has one hidden layer
// Note: bias is automatically set
//
// Units corresponds to feature vectors. Here there is only one feature vector which is Horsepower.
const createModel = () => {
  // Sequential becuase its inputs flow straight down to its output
  // NOTE: Other types of models can have branches, or even multiple inputs and outputs
  const model = tf.sequential()
  // Add a single hidden layer
  // A Dense Layer: is basically: Sigmoid(w1a1 + w2a2 + ... + wnan + bias)
  // Input Shape: is [1] because we only have 1 number as our input which is the horsepower
  // Units: sets how big the weight matrix will be in the layer. By setting it to 1 here we are saying there will be 1 weight for each of the inputs features of the data
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }))
  // Add an output layer
  // Units: is 1 because we only want to output one number.
  model.add(tf.layers.dense({ units: 1, useBias: true }))
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }))

  return model
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
const convertToTensor = data => {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors.

  // What are intermediat tensors?
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

const trainModel = async (model, inputs, labels) => {
  // Prepare the model for training
  model.compile({
    // Algorithm that governs the updates to the model as it sees examples. Using Adam Optimizer - effective in practice and requires no configuration
    optimizer: tf.train.adam(),
    // Function that tells the model how well it's doing on learning each of the batches (data subsets) that are shown. meanSquaredError - Compares predictions made by the model with the true values.
    loss: tf.losses.meanSquaredError,
    metrics: ['mse']
  })

  // Refers to the size of the data subsets that the model will see on each iteration of the training. Common sizes range 32-512.
  // Selecting a batch size is complicated and requires understanding the underlying maths.
  const batchSize = 32
  // Number of times to look at the entire dataset. In this case it will loop over all the data 50 times.
  const epochs = 200

  // model.fit starts the training loop. Monitoring training process through tfvis
  return model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'], // mse = mean squared error
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  })
}

const testModel = (model, inputData, normalizationData) => {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData

  // Generate predictions for a uniform range of numbers between 0 and 1;
  // We un-normalize the data by doing the inverse of the min-max scaling
  // that we did earlier.
  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100)
    const preds = model.predict(xs.reshape([100, 1]))

    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(labelMin)
    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin)

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()]
  })

  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] }
  })

  const originalPoints = inputData.map(d => ({
    x: d.horsepower, y: d.mpg
  }))

  tfvis.render.scatterplot(
    { name: 'Model Predictions vs Original Data' },
    { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  )
}

/* ----> Data Collection <---- */

// Get the sample data from Google, Clean it up and return it.
const getData = async () => {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
  const carsData = await carsDataReq.json()
  // Creates new data object that only picks out the miles per gallon and horsepower parameters
  // A filter is set to not include any data that is null
  const cleaned = carsData.map(car => ({
    mpg: car.Miles_per_Gallon,
    horsepower: car.Horsepower
  })).filter(car => (car.mpg != null && car.horsepower != null))

  return cleaned
}
