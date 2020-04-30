# vue 的 webpack 配置文件

> webpack 配置 vue、vant 多页面项目--实例 2019-03-07 18:36

### webpack.base.js

```javascript
const webpack = require("webpack");
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const NamedModulesPlugin = require("webpack/lib/NamedModulesPlugin");
const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length,
});

var glob = require("glob");

var base = path.join(__dirname, "../src/pages");
var jsFiles = path.join(base, "./**/*.js");
var jsFileMap = {};
var baseLength = base.length;
glob.sync(jsFiles).forEach((item) => {
  var offsetFile = item.slice(baseLength + 1, -3);
  jsFileMap[offsetFile] = `./src/pages/${offsetFile}`;
});
// const outputPath = '../../htdocs/static';
const outputPath = "../static";
var config = {
  entry: jsFileMap,
  externals: {
    vue: "Vue",
    vant: "vant",
  },
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "@src": path.resolve("./src"),
      "@components": path.resolve("./src/components"),
      "@modules": path.resolve("./src/modules"),
      "@utils": path.resolve("./src/utils"),
      "@styles": path.resolve("./src/styles"),
      "@img": path.resolve("./src/img"),
      vue$: "vue/dist/vue.common.js",
    },
  },
  output: {
    path: path.join(__dirname, `${outputPath}/dist`),
    publicPath: "/dist/",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: "url-loader",
        options: {
          limit: 1024,
          name: "img/[name].[ext]",
          outputPath: "../",
          publicPath: "/",
        },
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
      {
        test: /\.js$/,
        // loader: 'babel-loader',
        exclude: /node_modules/,
        use: {
          loader: "happypack/loader?id=js",
        },
      },
      {
        test: /\.(sa|sc|c|le)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
    ],
  },
  // 插件
  plugins: [
    new NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../libs"),
        to: path.resolve(__dirname, outputPath),
      },
    ]),
    // 重命名提取后的css文件
    new MiniCssExtractPlugin({
      filename: "../css/[name].css",
    }),

    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: "js",
      // threads: 2,
      loaders: ["babel-loader?cacheDirectory=true"],
      //共享进程池
      threadPool: happyThreadPool,
      // 不允许 HappyPack 输出日志
      verbose: false,
    }),
  ],
};
module.exports = config;
```

### webpack.dev.conf.js

```javascript
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.js");

module.exports = merge(baseWebpackConfig, {
  mode: "development",
});
```

### webpack.prod.conf.js

```javascript
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.js");
const optimizeCss = require("optimize-css-assets-webpack-plugin");

module.exports = merge(baseWebpackConfig, {
  mode: "production",
  plugins: [
    new optimizeCss({
      assetNameRegExp: /\.less\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
      },
      canPrint: true,
    }),
  ],
  optimization: {
    minimizer: [new optimizeCss({})],
  },
});
```
