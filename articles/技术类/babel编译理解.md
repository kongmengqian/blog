# Babel 构建

## 工作原理

> It basically acts like `const babel = code => code;` by parsing the code and then generating the same code back out again.

1. parsing：解析（词法分析）。用`babylon`对`ES6`代码进行词法分析-->`AST`抽象语法树
2. transforming：转译。把上一步解析出来的`AST`-->根据配置，也就是输入参数，调用插件`babel-traverse`，进行一系列算法-->新的`AST`抽象语法树-->用`babel-generator`生成`ES5`
3. printing：输出。得到 ES5

## 核心内容

1. plugins：插件。转换插件自动启动语法插件，如果已经设置了转换插件就不需要再设置语法插件了。
2. presets：预加载。
3. polyfill：使用`babel-polyfill`会把`ES2015+`环境整体引入到代码的全局环境中，任何文件都可以直接使用新标准所引入的新原生对象，新 API 等。核心代码库是`core-js`对新原生对象和新 API 做了兼容，让开发者可以放心的使用`ES6+`
4. runtime： `polyfill`是所有的都引入，且一般放在全局环境中，可能会造成污染全局环境，造成不必要的浪费和问题。就有了局部引入，按需引入的需求，就出来了`runtime`。有`transform-runtime`和`babel-runtime`
5. options：配置。

- env：指定在不同环境下使用的配置。`production/development`
- plugins：要加载和使用的插件列表，插件名前的`babel-plugin-`可省略；plugin 列表按**从头到尾的顺序**运行
- presets：要加载和使用的`preset`列表，`preset`名前的`babel-preset-`可省略；`presets`列表的`preset`按**从尾到头的**逆序运行
- 其他各种各样的`options`，见官方文档

## 参考资料

- [【JavaScript】深入理解 Babel 原理及其使用](https://www.jianshu.com/p/e9b94b2d52e2)
- [babel 官方文档](https://babeljs.io/docs/en/)
