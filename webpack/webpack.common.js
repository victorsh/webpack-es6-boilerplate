const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, '../src/src-sw.js'),
      swDest: 'sw.js'
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../src/assets'), to: path.resolve(__dirname, '../dist') }
    ])
    // new webpack.ProvidePlugin({
    //   THREE: 'three'
    // })
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [{
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf|fnt)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.mp3$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    }]
  }
}
