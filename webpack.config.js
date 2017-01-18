'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const loaders = require('./webpack/loaders');
const clientPlugins = require('./webpack/plugins');
const postcss = require('./webpack/postcss');
const ENV = process.env.npm_lifecycle_event;
const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  devtool: isProduction ?
    'source-map' :
    'inline-source-map',

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },

  devServer: {
    historyApiFallback: { index: '/' },
    proxy: {},
  },

  module: {
    rules: [
      loaders.angular,
      loaders.tslint,
      loaders.tsjit,
      loaders.html,
      loaders.svg,
      loaders.eot,
      loaders.woff,
      loaders.woff2,
      loaders.ttf,
      loaders.localCss,
      loaders.globalCss,
      loaders.localScss,
      loaders.globalScss,
    ],
  },
};

const clientConfig = {
  target: 'web',
  entry: {
    app: './src/client.ts',
    vendor: [
      './src/vendor.ts',
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: isProduction ?
      '[name].[chunkhash].js' : '[name].js',
    publicPath: '/',
    sourceMapFilename: isProduction ?
      '[name].[chunkhash].js.map' : '[name].js.map',
    chunkFilename: isProduction ?
      '[name].chunk.[chunkhash].js' : '[name].js',
  },
};

const matchPackages = (...packages) => {
  return (context, request, cb) => {
    if (packages.some(p => request.indexOf(p) >= 0)) {
      return cb();
    }
    else if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
      return cb(null, `commonjs ${request}`);
    }
    else {
      return cb();
    }
  };
};

const serverConfig = {
  target: 'node',
  entry: './src/server.ts',
  output: {
    filename: 'index.js',
    path: './dist/server',
    libraryTarget: 'commonjs2'
  },
  externals: matchPackages(
    '@angularclass',
    '@angular',
    'angular-',
    'angular2',
    '-ng2',
    '-ng',
    'ng2-',
    'ng-',
    '@ng-',
    '@ngrx',
    'ngrx-'
  ),
  node: {
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  },
};

const serverPlugins = [
  new webpack.ContextReplacementPlugin(
    /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
    path.join(__dirname, 'src'),
    {}),
  new webpack.LoaderOptionsPlugin({
   test: /\.css$/,
   options: {
     postcss,
   },
  }),
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    __PRODUCTION__: process.env.NODE_ENV === 'production',
    __TEST__: JSON.stringify(process.env.TEST || false),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  new ExtractTextPlugin('styles.[contenthash].css'),
];

module.exports = [
  webpackMerge({}, baseConfig, clientConfig, {plugins: clientPlugins}),
  webpackMerge({}, baseConfig, serverConfig, {plugins: serverPlugins}),
];

