const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Fiber = require('fibers');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development'
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader, options: {
          sourceMap: true
        }
      }, {
        loader: "css-loader", options: {
          sourceMap: true
        }
      }, {
        loader: "sass-loader", options: {
          implementation: require("sass"),
          fiber: Fiber,
          sourceMap: true
        }
      }]
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
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
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
}