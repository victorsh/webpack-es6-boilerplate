const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const express = require('express')
const app = express()
const path = require('path')

const port = process.env.PORT
const config = process.env.NODE_ENV === 'production' ? require('./webpack/webpack.prod.js') : require('./webpack/webpack.dev.js')
const compiler = webpack(config)

console.log(path.resolve(__dirname, './dist'))

app.use(
  middleware(compiler, {
    // webpack-dev-middleware options
  })
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
