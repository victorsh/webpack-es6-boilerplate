import * as tf from '@tensorflow/tfjs'

export const runTF = async () => {
  document.addEventListener('DOMContentLoaded', await run())
}

const run = async () => {
  // await leaker()
  await disposable()
  await tidied()
}

const leaker = async () => {
  console.log('hello')

  const values = []
  for (let i = 0; i < 150000; i++) {
    values[i] = Math.floor(Math.random() * 1000)
  }

  const shape = [500, 300]

  const a = tf.tensor2d(values, shape, 'int32')
  const b = tf.tensor2d(values, shape, 'int32')
  const bt = b.transpose()
  const c = a.matMul(bt)

  console.log(tf.memory().numTensors)
}

const disposable = async () => {
  console.log('hello')

  const values = []
  for (let i = 0; i < 150000; i++) {
    values[i] = Math.floor(Math.random() * 1000)
  }

  const shape = [500, 300]

  const a = tf.tensor2d(values, shape, 'int32')
  const b = tf.tensor2d(values, shape, 'int32')
  const bt = b.transpose()
  const c = a.matMul(bt)

  // Manually dispose memory leak
  a.dispose()
  b.dispose()
  c.dispose()
  bt.dispose()

  console.log(tf.memory().numTensors)
}

const tidied = async () => {
  console.log('hello')

  const values = []
  for (let i = 0; i < 150000; i++) {
    values[i] = Math.floor(Math.random() * 1000)
  }

  const shape = [500, 300]

  tf.tidy(() => {
    const test = tf.tensor2d(values, shape)
    const a = tf.tensor2d(values, shape, 'int32')
    const b = tf.tensor2d(values, shape, 'int32')
    const b_t = b.transpose()
    const c = a.matMul(b_t)
  })

  console.log(tf.memory().numTensors)
}