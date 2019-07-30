const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const Fiber = require('fibers')
var DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new DashboardPlugin()
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: 'style-loader',
        options: {
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
          options: {
            sourceMap: true
          }
        }
      }]
    }]
  }
})
