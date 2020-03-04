import * as tf from '@tensorflow/tfjs'

// https://www.youtube.com/watch?v=F4WWukTWoXY
export const runTF = async () => {
  document.addEventListener('DOMContentLoaded', await run())
}

const run = async () => {
  await emptyCompleteLayer()
}

// Linear regression, find the line that fits the points

const emptyCompleteLayer = async () => {
  // Input Layer: 2
  // Hidden Layer: 4
  // Output Layer; 3
  const model = tf.sequential()

  // inputShape: ex array with 2 spots => [2]
  // inputBatchShape: 100 arrays with 2 spots each => [2, 100]

  // 2 -> 4
  const hidden = tf.layers.dense({ units: 4, activation: 'sigmoid', inputShape: [2] })
  // 4 -> 4
  const hidden2 = tf.layers.dense({ units: 4, activation: 'sigmoid', inputShape: [4] })
  // 4 -> 3
  const output = tf.layers.dense({ units: 3, activation: 'sigmoid', inputShape: [4] })

  model.add(hidden)
  model.add(hidden2)
  model.add(output)

  // sgd optimizer: using stochastic gradient decent and the learning rate is 0.1
  const sgdOptimizer = tf.train.sgd(0.1)

  const config = { optimizer: sgdOptimizer, loss: 'meanSquaredError' }

  model.compile(config)
}
