## webpack 核心原理

### 工作流程

1. 初始化

- 初始化参数：配置文件(webpack.config.js)和 shell 语句中读取与合并参数，得到最终的参数。并初始化需要使用的插件和配置插件等执行环境所需要的参数。
- 初始化默认参数配置：`new WebpackOptionsDefaulter().process(options)`
- 实例化 `compiler` 对象：用上一步得到的参数初始化 `Compiler` 实例，`Compiler` 负责文件监听和启动编译。`Compiler` 实例中包含了完整的 Webpack 配置，全局只有一个 `Compiler` 实例。
- 加载插件：依次调用插件的 `apply` 方法，让插件可以监听后续的所有事件节点。同时给插件传入 `compiler` 实例的引用，以方便插件通过 `compiler` 调用 Webpack 提供的 API。
- 处理入口：读取配置的 `Entrys`，为每个 `Entry` 实例化一个对应的 `EntryPlugin`，为后面该 `Entry` 的递归解析工作做准备。

2. 编译

- run：启动一次新的编译。`this.hooks.run.callAsync`。
- compile: 该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上 `compiler` 对象。
- compilation: 当 Webpack 以开发模式运行时，每当检测到文件变化，一次新的 `Compilation` 将被创建。一个 `Compilation` 对象包含了当前的模块资源、编译生成资源、变化的文件等。`Compilation` 对象也提供了很多事件回调供插件做扩展。
- make:一个新的 `Compilation` 创建完毕，开始编译 `this.hooks.make.callAsync`。
- `addEntry`: 即将从 `Entry` 开始读取文件。
- `_addModuleChain`: 根据依赖查找对应的工厂函数，并调用工厂函数的 create 来生成一个空的 `MultModule` 对象，并且把 `MultModule` 对象存入 `compilation` 的 `modules` 中后执行 `MultModule.build`。
- buildModules: 使用对应的 Loader 去转换一个模块。开始编译模块,`this.buildModule(module) buildModule(module, optional, origin,dependencies, thisCallback)`。
- build: 开始真正编译模块。
- doBuild: 开始真正编译入口模块。
- `normal-module-loader`: 在用 Loader 对一个模块转换完后，使用 `acorn` 解析转换后的内容，输出对应的抽象语法树（AST），以方便 Webpack 后面对代码的分析。
- program: 从配置的入口模块开始，分析其 AST，当遇到 `require` 等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系。

3. 输出阶段

- seal: 封装 `compilation.seal seal(callback)`。
- addChunk: 生成资源 `addChunk(name)`。
- createChunkAssets: 创建资源 `this.createChunkAssets()`。
- getRenderManifest: 获得要渲染的描述文件 `getRenderManifest(options)`。
- render: 渲染源码 `source = fileManifest.render()`。
- afterCompile: 编译结束 `this.hooks.afterCompile`。
- shouldEmit: 所有需要输出的文件已经生成好，询问插件哪些文件需要输出，哪些不需要。`this.hooks.shouldEmit`。
- emit: 确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容。
- done: 全部完成 `this.hooks.done.callAsync`。

【参考文章】

- [一文掌握 Webpack 编译流程](https://mp.weixin.qq.com/s?__biz=MzI0MTUxOTE5NQ==&mid=2247484030&idx=1&sn=d630d4b3995bbfd50f99e781074acfeb)
