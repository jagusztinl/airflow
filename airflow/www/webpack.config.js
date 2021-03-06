/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const cwplg = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Input Directory (airflow/www)
// noinspection JSUnresolvedVariable
const STATIC_DIR = path.resolve(__dirname, './static');

// Output Directory (airflow/www/static/dist)
// noinspection JSUnresolvedVariable
const BUILD_DIR = path.resolve(__dirname, './static/dist');

const config = {
  entry: {
    airflowDefaultTheme: `${STATIC_DIR}/css/bootstrap-theme.css`,
    connectionForm: `${STATIC_DIR}/js/connection_form.js`,
    dags: `${STATIC_DIR}/css/dags.css`,
    flash: `${STATIC_DIR}/css/flash.css`,
    gantt: [`${STATIC_DIR}/css/gantt.css`, `${STATIC_DIR}/js/gantt.js`],
    graph: `${STATIC_DIR}/css/graph.css`,
    ie: `${STATIC_DIR}/js/ie.js`,
    loadingDots: `${STATIC_DIR}/css/loading-dots.css`,
    main: [`${STATIC_DIR}/css/main.css`, `${STATIC_DIR}/js/main.js`],
    materialIcons: `${STATIC_DIR}/css/material-icons.css`,
    moment: 'moment-timezone',
    switch: `${STATIC_DIR}/css/switch.css`,
    taskInstances: `${STATIC_DIR}/js/task_instances.js`,
    taskInstance: `${STATIC_DIR}/js/task_instance.js`,
    tree: `${STATIC_DIR}/css/tree.css`,
    circles: `${STATIC_DIR}/js/circles.js`,
    durationChart: `${STATIC_DIR}/js/duration_chart.js`,
    trigger: `${STATIC_DIR}/js/trigger.js`,
    variableEdit: `${STATIC_DIR}/js/variable_edit.js`,
    dagCode: `${STATIC_DIR}/js/dag_code.js`,
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    library: ['Airflow', '[name]'],
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.css',
    ],
  },
  module: {
    rules: [
      {
        test: /datatables\.net.*/,
        loader: 'imports-loader?define=>false',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      // Extract css files
      {
        test: /\.css$/,
        include: STATIC_DIR,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          'css-loader',
        ],
      },
      /* for css linking images */
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
            },
          },
        ],
      },
      /* for fonts */
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              mimetype: 'application/font-woff',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new ManifestPlugin(),
    new cwplg.CleanWebpackPlugin({
      verbose: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    }),

    // MomentJS loads all the locale, making it a huge JS file.
    // This will ignore the locales from momentJS
    new MomentLocalesPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    // Since we have all the dependencies separated from hard-coded JS within HTML,
    // this seems like an efficient solution for now. Will update that once
    // we'll have the dependencies imported within the custom JS
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/nvd3/build/*.min.*',
          flatten: true,
        },
        // Update this when upgrade d3 package, as the path in new D3 is different
        {
          from: 'node_modules/d3/d3.min.*',
          flatten: true,
        },
        {
          from: 'node_modules/dagre-d3/dist/*.min.*',
          flatten: true,
        },
        {
          from: 'node_modules/d3-tip/dist/index.js',
          to: 'd3-tip.js',
          flatten: true,
        },
        {
          from: 'node_modules/bootstrap-3-typeahead/*min.*',
          flatten: true,
        },
        {
          from: 'node_modules/datatables.net/**/**.min.*',
          flatten: true,
        },
        {
          from: 'node_modules/datatables.net-bs/**/**.min.*',
          flatten: true,
        },
        {
          from: 'node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
          flatten: true,
        },
        {
          from: 'node_modules/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
          flatten: true,
        },
        {
          from: 'node_modules/redoc/bundles/redoc.standalone.*',
          flatten: true,
        },
        {
          from: 'node_modules/codemirror/lib/codemirror.*',
          flatten: true,
        },
        {
          from: 'node_modules/codemirror/addon/lint/**.*',
          flatten: true,
        },
        {
          from: 'node_modules/codemirror/mode/javascript/javascript.js',
          flatten: true,
        },
        {
          from: 'node_modules/jshint/dist/jshint.js',
          flatten: true,
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
};

module.exports = config;
