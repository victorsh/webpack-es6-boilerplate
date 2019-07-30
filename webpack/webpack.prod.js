const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const Fiber = require('fibers')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          minimize: true,
          sourceMap: true
        }
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
          fiber: Fiber,
          sourceMap: true,
          options: {
            minimize: true,
            sourceMap: true
          }
        }
      }]
    }]
  }
})
