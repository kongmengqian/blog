# 手把手教你搭建一个基于 react+TS+antd 的组件库(2)

> [项目地址：kongmengqian/npm-my-libs](https://github.com/kongmengqian/npm-my-libs)

# webpack 篇

上一篇主要讲述了 npm package 的发布、更新、删除、开发过程中的调试，以及拥有一个私有库的几种方式，这篇来讲讲怎么把我们写的代码**编译打包**（即各种语法转换成 ES5）出来后，各个环境（浏览器、node）都可以使用，且不局限引用方式，即可以用 ES6 的 import，node 的 require，以及 script 标签。我们先从 babel 入手。

## babel

**babel is a JavaScript compiler**
Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. Here are the main things Babel can do for you:

- Transform syntax
- Polyfill features that are missing in your target environment (through [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill))
- Source code transformations (codemods)
- And more! (check out these [videos](https://babeljs.io/videos.html) for inspiration)

——摘抄 [babel](https://babeljs.io/docs/en/)

### babel 入门

The entire process to set this up involves:

1. Running these commands to install the packages:

```shell
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
```

2. Creating a config file named  `babel.config.json`  in the root of your project with this content:

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```

3. And running this command to compile all your code from the  `src`  directory to  `lib` :

```shell
./node_modules/.bin/babel src --out-dir lib
```

> You can use the npm package runner that comes with npm@5.2.0 to shorten that command by replacing  `./node_modules/.bin/babel`  with  `npx babel`
> ——摘抄 [babel 指南-Usage Guide](https://www.babeljs.cn/docs/usage)

### 进入正题，怎么一步一步把 ES6+react+TS 编译成浏览器认识的代码呢？

【_小白提问：我想要在组件库中使用 ES6/7/8/9 等等最新的 javascript 语法，可是浏览器不兼容怎么办？_】

#### @babel/preset-env

`@babel/preset-env`  is a smart preset that allows you to use the** latest JavaScript** without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s). This both makes your life easier and JavaScript bundles smaller!
——[摘抄 babel presets-env](https://www.babeljs.cn/docs/babel-preset-env)

```shell
npm install --save-dev @babel/preset-env

yarn add @babel/preset-env --dev
```

【小白提问：我的组件库是用 react 写的，react 又要怎么转换呢？】

#### @babel/preset-react

This preset always includes the following plugins:

- [@babel/plugin-syntax-jsx](https://www.babeljs.cn/docs/babel-plugin-syntax-jsx)
- [@babel/plugin-transform-react-jsx](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx)
- [@babel/plugin-transform-react-display-name](https://www.babeljs.cn/docs/babel-plugin-transform-react-display-name)

And with the `development` option:

- [@babel/plugin-transform-react-jsx-self](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx-self)
- [@babel/plugin-transform-react-jsx-source](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx-source)

——摘抄 [babel presets-react](https://www.babeljs.cn/docs/babel-preset-react)

```shell
npm install --save-dev @babel/preset-react

yarn add @babel/preset-react --dev
```

【小白提问：我打算用 TypeScript 来写我的组件库，避免我编程的时候犯的一些低级错误，对组件使用者也相对更友好一些，那 ts 又需要用什么转换呢？】

#### @babel/preset-typescript

This preset includes the following plugins:

- [@babel/plugin-transform-typescript](https://www.babeljs.cn/docs/babel-plugin-transform-typescript)

> You will need to specify  `--extensions ".ts"`  for  `@babel/cli`  &  `@babel/node`  cli's to handle  `.ts`  files.

——摘抄 [babel presets-typescript](https://www.babeljs.cn/docs/babel-preset-typescript)

```shell
npm install --save-dev @babel/preset-typescript
```

#### Usage

```json
// presets逆序执行（从后往前）ts -> react -> ES6/7
// preset的参数怎么写，有哪些，请自行查阅官方文档，这里不展开
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

### 补充

#### [@babel/polyfill](https://www.babeljs.cn/docs/babel-polyfill)

Now luckily for us, we're using the  `env`  preset which has a  `"useBuiltIns"`  option that when set to  `"usage"`  will practically apply the last optimization mentioned above where you only include the polyfills you need. With this new option the configuration changes like this:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage" // https://www.babeljs.cn/docs/usage#polyfill
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

【笔者理解】简单的来说， `useBuiltIns` 设置为 `usage` ，babel 会自动 import 对应的 modules，简单方便。[参考](https://www.babeljs.cn/docs/babel-preset-env#usebuiltins)

```javascript
// In a.js
var a = new Promise();

// Out (if environment doesn't support it)
import "core-js/modules/es.promise";
var a = new Promise();

// Out (if environment supports it)
var a = new Promise();
```

#### [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)

编译装饰器
**Simple class decorator**

```javascript
@annotation
class MyClass {}

function annotation(target) {
  target.annotated = true;
}
```

如果 `legacy` 字段设为 `true` 的话，就要配合[@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)使用，且 `loose` 要设置为 `true` ，[参考](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)

```json
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
}
```

#### [@babel/plugin-transform-runtime](https://www.babeljs.cn/docs/babel-plugin-transform-runtime)

A plugin that enables the re-use of Babel's injected helper code to save on codesize.

> Instance methods such as  `"foobar".includes("foo")`  will only work with  `core-js@3` . If you need to polyfill them, you can directly import  `"core-js"`  or use  `@babel/preset-env` 's  `useBuiltIns`  option.

The plugin transforms the following:

```javascript
var sym = Symbol();

var promise = Promise.resolve();

var check = arr.includes("yeah!");

console.log(arr[Symbol.iterator]());
```

into the following:

```javascript
import _getIterator from "@babel/runtime-corejs3/core-js/get-iterator";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
import _Promise from "@babel/runtime-corejs3/core-js-stable/promise";
import _Symbol from "@babel/runtime-corejs3/core-js-stable/symbol";

var sym = _Symbol();

var promise = _Promise.resolve();

var check = _includesInstanceProperty(arr).call(arr, "yeah!");

console.log(_getIterator(arr));
```

——摘抄 [babel 用法-transform-runtime](https://www.babeljs.cn/docs/babel-plugin-transform-runtime)

【笔者理解】可以自动引入对应 Babel's injected helper code，同 use `@babel/preset-env` 's `useBuiltIns` option

###

### 总结

基础配置 ok 了，其他的语法需要 babel 解析的话，可以再自行查找[babel-plugins](https://www.babeljs.cn/docs/plugins)。
（说一下笔者的操作，先一顿狂写，然后编译一下，babel 会报错，报啥错，就安装啥插件，简单粗暴。每次的错误都要用心记录下来哦，这样以后就可以提前安装好需要的各种 babel plugins 了）

## 模块概念

[ES6 Module 的加载实现](https://es6.ruanyifeng.com/#docs/module-loader)（比较了 ES6 和 CommonJs 的差异、循环加载等）

### CommonJS

- 所有代码都运行在模块作用域，不会污染全局作用域；
- 模块是**同步加载**的，即只有加载完成，才能执行后面的操作；
- 模块在首次执行后就会**缓存**，再次加载只返回缓存结果，如果想要再次执行，可清除缓存；
- CommonJS 输出是**值的拷贝**(即， `require` 返回的值是被输出的值的拷贝，模块内部的变化也不会影响这个值)。

基本用法

```javascript
//a.js
module.exports = function () {
  console.log("hello world");
};

//b.js
var a = require("./a");

a(); //"hello world"

//或者

//a2.js
exports.num = 1;
exports.obj = {
  xx: 2,
};

//b2.js
var a2 = require("./a2");

console.log(a2); //{ num: 1, obj: { xx: 2 } }
```

——摘抄 [掘金 再次梳理 AMD、CMD、CommonJS、ES6 Module 的区别](https://juejin.im/post/5db95e3a6fb9a020704bcd8d)

### AMD 和 require.js

**异步加载，依赖前置，提前执行**

```javascript
//a.js
//define可以传入三个参数，分别是字符串-模块名、数组-依赖模块、函数-回调函数
define(function () {
  return 1;
});

// b.js
//数组中声明需要加载的模块，可以是模块名、js文件路径
require(["a"], function (a) {
  console.log(a); // 1
});
```

### CMD 和 sea.js

**异步加载，依赖就近，延迟执行**

```javascript
/** AMD写法 **/
define(["a", "b", "c", "d", "e", "f"], function (a, b, c, d, e, f) {
  // 等于在最前面声明并初始化了要用到的所有模块
  a.doSomething();
  if (false) {
    // 即便没用到某个模块 b，但 b 还是提前执行了
    b.doSomething();
  }
});

/** CMD写法 **/
define(function (require, exports, module) {
  var a = require("./a"); //在需要时申明
  a.doSomething();
  if (false) {
    var b = require("./b");
    b.doSomething();
  }
});

/** sea.js **/
// 定义模块 math.js
define(function (require, exports, module) {
  var $ = require("jquery.js");
  var add = function (a, b) {
    return a + b;
  };
  exports.add = add;
});
// 加载模块
seajs.use(["math.js"], function (math) {
  var sum = math.add(1 + 2);
});
```

——摘抄 [掘金 前端模块化：CommonJS, AMD, CMD, ES6](https://juejin.im/post/5aaa37c8f265da23945f365c)

### ES6

- CommonJS 模块是运行时加载，ES6 Module 是**编译时输出接口**；
- CommonJS 加载的是整个模块，将所有的接口全部加载进来，ES6 Module 可以**单独加载其中的某个接口**；
- CommonJS 输出是值的拷贝，ES6 Module 输出的是**值的引用**，被输出模块的内部的改变会影响引用的改变；
- CommonJS `this` 指向当前模块，ES6 Module **`this`\*\***指向\***\*`undefined`**;

——摘抄 [掘金 再次梳理 AMD、CMD、CommonJS、ES6 Module 的区别](https://juejin.im/post/5db95e3a6fb9a020704bcd8d)

```javascript
// a.js
const
function a() => {
  console.log("this is in a");
}
export {
  a,
}

// b.js
import {
  a
} from "./a";
a(); // this is in a
```

### webpack 模块编译配置项

[webpack 概念-modules](https://www.webpackjs.com/concepts/modules/)
[webpack 指南-创建 library](https://www.webpackjs.com/guides/author-libraries/)
[webpack 配置-output.libraryTarget](https://www.webpackjs.com/configuration/output/#output-librarytarget)
[webpack 配置-output.library](https://www.webpackjs.com/configuration/output/#output-library)

我们希望包可以在任何的环境下运行，支持常见的三种引用方式

- import 引用
- require 引用
- script 标签引用

所以输出的 libraryTarget 要配置为 `umd`
`libraryTarget: "umd"`  - 将你的 library 暴露为所有的模块定义下都可运行的方式。它将在 **CommonJS, AMD 环境下运行**，或将模块导出到 global 下的变量。了解更多请查看  [UMD 仓库](https://github.com/umdjs/umd)。

webapck.config.json

```javascript
var path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    library: "MyLibrary",
    libraryTarget: "umd",
  },
};
```

最终输出

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["MyLibrary"] = factory();
  else root["MyLibrary"] = factory();
})(typeof self !== "undefined" ? self : this, function () {
  return _entry_return_; // 此模块返回值，是入口 chunk 返回的值
});
```

——摘自 [webpack 配置-output.libraryTarget-模块定义系统-umd](https://www.webpackjs.com/configuration/output/#%E6%A8%A1%E5%9D%97%E5%AE%9A%E4%B9%89%E7%B3%BB%E7%BB%9F)

### 扩展

- node 中 Module 又是怎么一回事？

## webpack 配置

[webpack 配置-libraryTargets](https://www.webpackjs.com/configuration/output/#output-librarytarget)【这些选项将导致 bundle 带有更完整的模块头部，**以确保与各种模块系统的兼容性**。根据   `output.libraryTarget`   选项不同， `output.library`   选项将具有不同的含义。】
[webpack 指南-创建 library](https://www.webpackjs.com/guides/author-libraries/)
[webpack 配置-externals](https://www.webpackjs.com/configuration/externals/)【**防止**将某些   `import`   的包(package)**打包**到 bundle 中，而是在运行时(runtime)再去从外部获取这些*扩展依赖(external dependencies)*。】
[webpack 配置-targets](https://www.webpackjs.com/configuration/target/)【webpack 可以编译成不同环境下运行的代码，例如 node、web(默认)】
[webpack 指南-构建性能](https://www.webpackjs.com/guides/build-performance/)

安装以下依赖，配置一个最基础的 webpack

```shell
npm install webpack webpack-cli -D
```

webpack.condig.js

```javascript
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "MyLibrary",
    libraryTarget: "umd",
    publicPath: "./",
  },
};
```

### loader

- [loader](https://www.webpackjs.com/concepts/loaders/) 用于对模块的源代码进行转换
- 逆向执行

### plugins

- [plugins](https://www.webpackjs.com/concepts/plugins/)目的在于解决  [loader](https://www.webpackjs.com/concepts/loaders)  无法实现的**其他事**。
- 正常顺序执行

### ES6

安装以下依赖

```shell
npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm install babel-loader -D
```

webpack 编译 ES6 的配置如下：

```javascript
// ./webapck.config.js
var path = require("path");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "MyLibrary",
    libraryTarget: "umd",
  },
  devtool: process.env.debug ? "cheap-module-source-map" : "none",
  externals:
    // https://reactjs.org/docs/error-decoder.html?invariant=321
    !process.env.debug
      ? ["react", "react-dom"]
      : {
          React: "react",
          ReactDOM: "react-dom",
        },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/env"],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        ],
        include: [path.resolve(__dirname, "src")],
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
};
```

### typescript

[webpack 指南-TypeScript](https://www.webpackjs.com/guides/typescript/)
[ts-loader](https://github.com/TypeStrong/ts-loader)
[tsconfig.json 配置说明（官方）](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
[tsconfig.json 配置文件（官方）](http://json.schemastore.org/tsconfig)
[tsconfig.json 配置详解](https://segmentfault.com/a/1190000021749847)

安装以下依赖

```shell
npm install typescript
npm install ts-loader -D
```

webpack 编译 TS 的配置如下，具体分析见下一篇

```javascript
  module: {
    rules: [{
      test: /\.(tsx|ts)$/,
      use: [{
          loader: "babel-loader",
          options: {
            presets: ["@babel/env"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        },
        +{
          loader: "ts-loader"
        }
      ],
      include: [path.resolve(__dirname, "src")],
      exclude: /(node_modules|bower_components)/,
    }]
  },
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true, // 生成相应的 .d.ts文件。
    "declarationDir": "./types", // 生成声明文件的输出路径。
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
    "experimentalDecorators": true, // 启用实验性的ES装饰器。
    "module": "ES6",
    "target": "ES6",
    "skipLibCheck": true, // 忽略所有的声明文件（ *.d.ts）的类型检查。
    "esModuleInterop": true, // 通过导入内容创建命名空间，实现CommonJS和ES模块之间的互操作性
    "moduleResolution": "node", // 决定如何处理模块。或者是"Node"对于Node.js/io.js，或者是"Classic"（默认）。
    "strict": true, // 启用所有严格类型检查选项。
    "removeComments": false, // 删除所有注释，除了以 /!*开头的版权信息。
    "jsx": "react", // 在 .tsx文件里支持JSX： "React"或 "Preserve"。
    "sourceMap": true, // 生成相应的 .map文件。
    "downlevelIteration": true // 当target为"ES5"或"ES3"时，为"for-of" "spread"和"destructuring"中的迭代器提供完全支持
  },
  "exclude": ["node_modules", "build", "scripts", "**/*.css"] // 表示要排除的，不编译的文件
}
```

### react

安装以下依赖

```shell
npm install react react-dom @types/react @types/react-dom
npm install @babel/preset-react @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
```

webpack 编译 react 的配置如下：

```javascript
  options: {
    -presets: ["@babel/preset-env"],
    -plugins: ["@babel/plugin-transform-runtime"] +
      presets: ["@babel/preset-env", "@babel/preset-react"],
    +plugins: [

      + // https://babeljs.io/docs/en/babel-plugin-proposal-decorators
      + // If you are including your plugins manually and using @babel/plugin-proposal-class-properties, make sure that @babel/plugin-proposal-decorators comes before @babel/plugin-proposal-class-properties.
      + // When using the legacy: true mode, @babel/plugin-proposal-class-properties must be used in loose mode to support the @babel/plugin-proposal-decorators.

      +[
        +"@babel/plugin-proposal-decorators",
        +{

          + // Use the legacy (stage 1) decorators syntax and behavior.

          +legacy: true +
        } +
      ],
      +["@babel/plugin-transform-runtime"],
      +["@babel/plugin-proposal-class-properties", {
        loose: true
      }] +
    ]
  }
```

### antd

安装以下依赖

```shell
npm install antd
npm install babel-plugin-import -D
```

按需加载，[参考 babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

```javascript
  options: {
    presets: ["@babel/env", "@babel/react"],
    plugins: [
      +[
        +"import",
        +{
          +libraryName: "antd",

          + // libraryDirectory: "es", // 默认lib

          +style: true // `style: true` 会加载 less 文件
            +
        } +
      ],
      ["@babel/plugin-proposal-decorators", {
        legacy: true
      }],
      ["@babel/plugin-transform-runtime"],
      ["@babel/plugin-proposal-class-properties", {
        loose: true
      }]
    ]
  }
```

### less

对 less 文件做以下处理

- 用 ui.config.less 样式覆盖之前的样式，[参考 antd 在 webpack 中定制主题](https://ant.design/docs/react/customize-theme-cn)
- To make CSS modules work with Webpack。[参考 css-loader modules](https://github.com/webpack-contrib/css-loader#modules)

安装以下依赖

```shell
npm install less-loader css-loader style-loader -D
```

```javascript
{
  test: /\.less$/,
  use: [{
      loader: "style-loader"
    },
    {
      loader: "css-loader",
      options: {
        modules: {
          // localIdentName: '[path][name]__[local]',
          getLocalIdent: (context, _, localName) => {
            if (context.resourcePath.includes("node_modules")) {
              return localName;
            }
            return `demo__${localName}` ;
          },
        },
      },
    },
    {
      loader: "less-loader",
      options: {
        lessOptions: {
          // http://lesscss.org/usage/#command-line-usage-options
          javascriptEnabled: true,
          modifyVars: {
            // "primary-color": "#1DA57A",
            // "link-color": "#1DA57A",
            // "border-radius-base": "2px",
            // or
            // https://github.com/ant-design/ant-design/blob/d2214589391c8fc8646c3e8ef2c6aa86fcdd02a3/.antd-tools.config.js#L94
            hack: `true; @import "${require.resolve(
                    "./src/assets/style/ui.config.less"
                  )}";` // Override with less file
          }
        }
      }
    }
  ]
},
```

You can pass any Less specific options to the less-loader via [loader options](https://webpack.js.org/configuration/module/#rule-options-rule-query). See the [Less documentation](http://lesscss.org/usage/#command-line-usage-options) for all available options in dash-case.
——摘自 [webpack less-loader](https://www.webpackjs.com/loaders/less-loader/#%E7%A4%BA%E4%BE%8B)

#### 解释：globalVar&modifyVars

**Global Variables**

| 命令行写法                        | json 配置写法                       |
| :-------------------------------- | :---------------------------------- |
| `lessc --global-var="color1=red"` | `{ globalVars: { color1: 'red' } }` |

This option defines a variable that can be referenced by the file. Effectively the declaration is put at the top of your base Less file, meaning it can be used but it also can be overridden if this variable is defined in the file.

**Modify Variables**

| 命令行写法                        | json 配置                           |
| :-------------------------------- | :---------------------------------- |
| `lessc --modify-var="color1=red"` | `{ modifyVars: { color1: 'red' } }` |

As opposed to the global variable option, this puts the declaration at the end of your base file, meaning it will override anything defined in your Less file.
——摘抄 [less 官方文档](http://lesscss.org/usage/#command-line-usage-options)

### css module

[css module 文档](https://github.com/css-modules/css-modules)

## 参考资料

[webpack 官网](https://www.webpackjs.com/concepts/)
[babel 官网](https://babeljs.io/docs/en/)
[less 官网](http://lesscss.org/usage/)
[TypeScript 官网](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
[css-loader](https://github.com/webpack-contrib/css-loader)
[less-loader](https://github.com/webpack-contrib/less-loader)
[css module](https://github.com/css-modules/css-modules)
