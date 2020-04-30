# webpack 配置 vue、vant 多页面项目

> 2019-03-07 18:34

### 项目初始化

生成 package.json 文件

```
npm init
```

### 安装 webpack

webpack4 之后需要安装 webpack-cli，请注意需要安装在同一目录。到了 webpack4, webpack 已经将 webpack 命令行相关的内容都迁移到 webpack-cli，所以除了 webpack 外，我们还需要安装 webpack-cli

```
npm i webpack webpack-cli -D
```

### 安装 Vue

```
npm i vue --save
```

### 安装 vue 的其他依赖

```
npm i vue-html-loader vue-loader vue-style-loader vue-template-compiler -D
```

### 安装 webpack-dev-server 热更新

```
npm i webpack-dev-server -D
npm i vue-hot-reload-api -D
```

### 安装 browser-sync

浏览器同步工具，简单来说就是当你保存文件的同时浏览器自动刷新网页，省去了手动的环节。

```
npm i browser-sync -D
```

配置 package.json 里面命令

```
"start": "./node_modules/.bin/browser-sync start --server --port 9090 --no-ui --startPath public/index.html --files **/*.html --no-ghost-mode --no-notifyy",
```

### 安装 babel

将 es6 语法转化为 es5

```
npm i babel-core babel-loader babel-plugin-transform-runtime -D
npm i babel-preset-stage-0 babel-runtime babel-preset-es2015 -D
npm i @babel/core @babel/plugin-transform-runtime @babel/preset-env -D
npm i @babel/polyfill @babel/runtime --save
```

### 安装 Vant

```
npm i vant --save
```

`babel-plugin-import`  是一款 babel 插件，它会在编译过程中将 import 的写法自动转换为按需引入的方式

```
npm i babel-plugin-import -D
```

```javascript
// 对于使用 babel7 的用户，可以在 babel.config.js 中配置
module.exports = {
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true,
      },
      "vant",
    ],
  ],
};
```

### 安装 postcss-pxtorem

Vant 中的样式默认使用`px`作为单位，如果需要使用`rem`单位，推荐使用 postcee-pxtprem，是一款 postcss 插件，用于将单位转化为 rem。

```
npm i postcss-pxtorem -D
```

下面提供了一份基本的 postcss 配置，可以在此配置的基础上根据项目需求进行修改

```javascript
// 12px 对应0.55rem rootValue = 12/0.55 = 21.8
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ["Android >= 4.0", "iOS >= 7"],
    },
    "postcss-pxtorem": {
      rootValue: 21.8,
      propList: ["*"],
    },
  },
};
```

### 安装其他 postcss 依赖

```
npm i postcss-loader postcss-mixins -D
```

### 安装其他 css 处理的依赖

optimize-css-assets-webpack-plugin 用来压缩；
cssnano 是压缩规则
autoprefixer 自动补全 css 前缀的插件

```
npm i sass-loader style-loader less less-loader css-loader node-sass -D
npm i optimize-css-assets-webpack-plugin cssnano -D
npm i autoprefixer -D
```

### 安装抽离 css 样式的依赖

webpack4 之后需要使用 mini-css-extract-plugin 来替代 extract-text-webpack-plugin

```
npm i extract-text-webpack-plugin --D
npm i mini-css-extract-plugin --D
```

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 重命名提取后的css文件
new MiniCssExtractPlugin({
	filename: '../css/[name].css'
}),
```

### JSX 映射到 JavaScript

```
npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props -D
```

在 babel.config.js 中加入下面的配置

```javascript
{
  "presets": ["@vue/babel-preset-jsx"]
}

// 完整版
module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ],
    ['@vue/babel-preset-jsx']
  ],
  comments: false
};

```

### 安装处理图片的依赖

```
npm i url-loader file-loader -D
```

### 安装 copy-webpack-plugin 依赖

copy-webpack-plugin 是用在 webpack 中拷贝文件和文件夹的
主要是为了把源码中的 libs 文件夹拷贝到打包编译后的文件夹下

```
npm i copy-webpack-plugin -D
```

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');

new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../libs'),
        to: path.resolve(__dirname, outputPath)
      }
    ]),
```

###

### 安装 html-webpack-plugin

生成 html 文件

```
npm i html-webpack-plugin -D
```

### 安装优化 webpack 打包速度的插件 happypack

webpack 能同一时间处理多个业务

```
npm i happypack -D
```

### 安装 webpack-merge 区分开发和生产环境

```
npm i webpack-merge -D
```

### 安装 qs 字符处理字符串

```
npm i qs -D
```

### 安装 axio

是一个基于 promise 的 HTTP 库

```
npm i axios --save
```

### 命令

```
"dev": "webpack --watch --config config/webpack.dev.conf.js",
"build": "webpack --config config/webpack.prod.conf.js"，
"start": "./node_modules/.bin/browser-sync start --server --port 9090 --no-ui --startPath public/index.html --files **/*.html --no-ghost-mode --no-notifyy",
```
