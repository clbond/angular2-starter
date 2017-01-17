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
      loaders.ts_JiT,
      loaders.html,
      loaders.svg,
      loaders.eot,
      loaders.woff,
      loaders.woff2,
      loaders.ttf,
      {
        test: /\.css$/,
        exclude: root('src', 'app'),
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?sourceMap-loader!postcss-loader',
        })
      },
      {
        test: /\.css$/,
        include: root('src', 'app'),
        loader: 'raw-loader!postcss-loader',
      },
      {
        test: /\.scss$/,
        exclude: root('src', 'app'),
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?sourceMap!postcss-loader!sass-loader',
        }),
      },
      {
        test: /\.scss$/,
        exclude: root('src', 'style'),
        loader: 'raw-loader!postcss-loader!sass-loader',
      },
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

const serverConfig = {
  target: 'node',
  entry: './src/server.ts',
  output: {
    filename: 'index.js',
    path: './dist/server',
    libraryTarget: 'commonjs2'
  },
  externals: includeClientPackages(
    /@angularclass|@angular|angular2-|ng2-|ng-|@ng-|angular-|@ngrx|ngrx-|@angular2|ionic|@ionic|-angular2|-ng2|-ng/
  ),
  node: {
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};

const serverPlugins = [
  new webpack.ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
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
  //new ExtractTextPlugin('styles.[contenthash].css'),
];

module.exports = [
  webpackMerge({}, baseConfig, clientConfig, {plugins: clientPlugins}),
  webpackMerge({}, baseConfig, serverConfig, {plugins: serverPlugins}),
];

function includeClientPackages(packages, localModule) {
  return function(context, request, cb) {
    if (localModule instanceof RegExp && localModule.test(request)) {
      return cb();
    }
    if (packages instanceof RegExp && packages.test(request)) {
      return cb();
    }
    if (Array.isArray(packages) && packages.indexOf(request) !== -1) {
      return cb();
    }
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
      return cb(null, 'commonjs ' + request);
    }
    return cb();
  };
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
