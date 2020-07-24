<<<<<<< HEAD
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isRunningDevServer = process.env.WEBPACK_DEV_SERVER;

module.exports = {
  entry: path.join(__dirname, "src/main.js"),
  output: {
    filename: "assets/js/[name].[contenthash].js",
    publicPath: "/",
  },
  plugins: [
    ...(isRunningDevServer ? [] : [new CleanWebpackPlugin()]), // ignore using CleanWebpackPlugin with dev server
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].[contenthash].css",
    }),
=======
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const isRunningDevServer = process.env.WEBPACK_DEV_SERVER
module.exports = {
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    filename: 'js/[name].[contenthash].js',
    publicPath: '/'
  },
  plugins: [
    // ...(
    //   isRunningDevServer
    //   ? []
    //   : 
    // ),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
>>>>>>> d3c4f652358caecc8cec475bee8747fdbc5f8800
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
<<<<<<< HEAD
        exclude: /node_modelues/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg)/i,
        loader: "file-loader",
        options: {
          name: "[name].[contenthash].[ext]",
          outputPaht: "assets/img",
        },
      },
    ],
  },
};
=======
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      }, 
      {
        test: /\.(png|jpg|jpeg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
          outputPath: 'assets/img'
        }
      }
    ]
  }
}
>>>>>>> d3c4f652358caecc8cec475bee8747fdbc5f8800
