const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/client/index.tsx',
  output: {
    filename: 'app.js',
    path: path.resolve('public'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  mode: 'development',
  module: {
    rules: [
      { test: /\.tsx?$/, exclude: /node_modules/, use: 'ts-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      base: '/',
    }),
  ],
  devtool: 'source-map',
};
