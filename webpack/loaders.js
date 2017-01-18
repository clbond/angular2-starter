'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.angular = { // ships in ES6 format now
  test: /\.js$/,
  loader: 'babel-loader',
  include: /angular/,
  exclude: /node_modules/,
  query: {
    compact: false,
  },
};

exports.tslint = {
  enforce: 'pre',
  test: /\.ts$/,
  loader: 'tslint-loader',
  exclude: /node_modules/,
};

exports.ts = {
  test: /\.ts$/,
  loader: '@ngtools/webpack',
};

exports.tsjit = {
  test: /\.ts$/,
  loaders: [
    'awesome-typescript-loader',
    'angular2-template-loader',
    'angular2-router-loader',
  ],
};

exports.istanbulInstrumenter = {
  enforce: 'post',
  test: /^(.(?!\.spec))*\.ts$/,
  loader: 'istanbul-instrumenter-loader',
};

exports.html = {
  test: /\.html$/,
  loader: 'raw-loader',
};

const root = (...args) => path.resolve(path.join(__dirname, '..', ...args));

exports.globalCss = {
  test: /\.css$/,
  exclude: root('src', 'app'),
  loader: ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: 'css-loader?sourceMap-loader!postcss-loader',
  })
};

exports.localCss = {
  test: /\.css$/,
  include: root('src', 'app'),
  loader: 'raw-loader!postcss-loader',
};

exports.globalScss = {
  test: /\.scss$/,
  exclude: root('src', 'style'),
  loader: 'raw-loader!postcss-loader!sass-loader',
};

exports.localScss = {
  test: /\.scss$/,
  exclude: root('src', 'app'),
  loader: ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: 'css-loader?sourceMap!postcss-loader!sass-loader',
  }),
};

exports.svg = makeFileLoader(/\.svg$/);
exports.eot = makeFileLoader(/\.eot$/);
exports.woff = makeFileLoader(/\.woff$/);
exports.woff2 = makeFileLoader(/\.woff2$/);
exports.ttf = makeFileLoader(/\.ttf$/);

function makeFileLoader(pattern) {
  return {
    test: pattern,
    loader: 'file-loader',
    exclude: /node_modules/,
  };
}
