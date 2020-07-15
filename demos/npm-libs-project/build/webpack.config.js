const path = require("path");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

// const extractLess = new ExtractTextPlugin({
//   filename: "[name].css",
//   // disable: process.env.NODE_ENV === "development"
// });

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  devtool: "source-map",
  devServer: {
    contentBase: "../dist",
  },
  module: {
    rules: [
      // 挂到<style>上
      //   {
      // test: /\.css$/,
      // use: ["style-loader", "css-loader", "sass-loader"],
      //   },
      // ExtractTextPlugin抽离css文件
      //   {
      //     test: /\.less$/i,
      //     use: extractLess.extract({
      //       use: [
      //         {
      //           loader: "css-loader",
      //         },
      //         {
      //           loader: "less-loader",
      //         },
      //       ],
      //       // 在开发环境使用 style-loader
      //       fallback: "style-loader",
      //     }),
      //   },
      // extract-loader抽离css文件
      {
        test: /\.less$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "css/[name].css",
            },
          },
          {
            loader: "extract-loader",
            options: {
              publicPath: "../",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      //   {
      //     test: /\.(js|jsx)$/,
      //     loader: "babel-loader",
      //   },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // extractLess
    new HtmlWebpackPlugin({
      title: "Output Management",
      //   template: path.resolve(__dirname, "../examples/index.html"),
    }),
  ],
};
