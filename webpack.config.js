const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  devtool: 'source-map',
  entry: slsw.lib.entries,
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
}
// const slsw = require('serverless-webpack');
//
// module.exports = {
//   entry: slsw.lib.entries,
//   target: 'node',
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: [
//           {
//             loader: 'babel-loader'
//           }
//         ]
//       }
//     ]
//   }
// }