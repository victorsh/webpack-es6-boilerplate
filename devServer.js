const path = require('path')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const httpsLocalhost = require('https-localhost')
const express = require('express')

let app = null
let config = null

if (process.env.NODE_ENV === 'production') {
  config = require('./webpack/webpack.prod.js')
  app = express()
} else {
  config = require('./webpack/webpack.dev.js')
  app = httpsLocalhost()
}

const port = process.env.PORT
const compiler = webpack(config)

console.log(path.resolve(__dirname, './dist'))

app.use(
  middleware(compiler, {
    // publicPath: path.resolve(__dirname, 'dist')
  })
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
