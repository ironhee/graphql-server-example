import path from 'path';
import webpack from 'webpack';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const WATCH = global.WATCH === undefined ? false : global.WATCH;

export default {
  devtool: 'cheap-module-eval-source-map',
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
  resolve: {
    modulesDirectories: [
      path.join(__dirname, '../client'),
      path.join(__dirname, '../node_modules'),
    ],
    extensions: ['', '.es6', '.js'],
  },
  entry: {
    app: [
      ...WATCH ? [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/dev-server',
      ] : [],
      path.join(__dirname, '../client/app.js'),
    ],
  },
  output: {
    path: path.join(__dirname, '../dist/static/'),
    filename: 'app.js',
    library: 'app',
    libraryTarget: 'umd',
  },
  plugins: [
    /* default */
    new webpack.optimize.OccurenceOrderPlugin(),
    /* watch */
    ...WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ] : [],
  ],
  module: {
    loaders: [
      {
        test: /\.(js|es6)$/,
        include: path.join(__dirname, '../client'),
        loaders: [...DEBUG ? ['react-hot'] : [], 'babel'],
      },
    ],
  },
};
