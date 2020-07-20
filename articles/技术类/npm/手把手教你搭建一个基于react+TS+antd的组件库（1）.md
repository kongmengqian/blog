# 手把手教你搭建一个基于 react+TS+antd 的组件库（1）

# npm 篇

在工作中，**模块之间**都会有一些**类似或者相同**的东西，而作为程序员我们要**把重复的代码提炼（抽象）**出来，**封装成函数**，供几个模块之间调用，使代码更加优雅，同是提高自己的抽象编程能力。随着经验的增长，会发现**项目与项目**之间也有一些**类似或者相同**的东西，**那么我们如何抽取，抽取出来的函数如何被各个项目使用呢？**我们可以借助**npm**包来实现，例如我们平时用到的 react、vue、antd 等等。

## 快速入门

接下来介绍一下 npm 包从 0-1 的搭建过程

1. 首先要有一个 npm 账号，去[npm 官网注册](https://www.npmjs.com/)，要记住自己的账号密码，发包之前需要先登录。
01. 新建一个文件夹，用来存放代码。
1. npm init 生成项目 package.json，一路默认即可，后期都是可以修改的(快捷方式：npm init -y)

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594779852512-4bd8db46-0e26-4a88-a9bc-af26af3c8780.png#align=left&display=inline&height=629&margin=%5Bobject%20Object%5D&name=image.png&originHeight=629&originWidth=595&size=50859&status=done&style=none&width=595)

04. 在根目录下新建 index.js 文件（因为 package.json 配置的入口文件是 index.js）
05. 随便编写一段代码

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594780640695-960243d6-6e35-4de3-9d0d-6ac94d9d9749.png#align=left&display=inline&height=123&margin=%5Bobject%20Object%5D&name=image.png&originHeight=123&originWidth=730&size=11416&status=done&style=none&width=730)

06. npm login 登录官方 npm

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594779390718-e6091a05-fddc-493d-a2c2-832bba2a24af.png#align=left&display=inline&height=377&margin=%5Bobject%20Object%5D&name=image.png&originHeight=377&originWidth=595&size=26923&status=done&style=none&width=595)

07. npm publish 发布（注意：发布前 npm 源要切到官方的源 npm config set registry=http://registry.npmjs.org）

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594780550994-79059ce1-48e4-4327-96d3-cfe351d7aaba.png#align=left&display=inline&height=686&margin=%5Bobject%20Object%5D&name=image.png&originHeight=686&originWidth=727&size=73176&status=done&style=none&width=727)

08. 可以在 npm 官网看到自己发布的所有的包

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594792338206-40942a97-e0af-4a95-b6cc-c09e47dca392.png#align=left&display=inline&height=864&margin=%5Bobject%20Object%5D&name=image.png&originHeight=864&originWidth=1920&size=116518&status=done&style=none&width=1920)

09. 发布成功之后，别人就可以通过 npm install <包名> 来安装使用你的包了。
10. 到这里就结束了，是不是很简单。但是我们平时写的代码是比较复杂的，还会用到 react、vue、ES6、TS 等等，还需要兼容多种平台，这就需要理解【模块】的概念，以及对源码做打包编译的处理。在后面的文章中我们会介绍。

### 如何更新包？

首先来看几个 npm 命令。
npm view <package_name> versions 该命令是查看包的版本，会打印出该包的发布版本。

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594796092080-c78472bb-f184-41b2-b7ab-cc595bad42de.png#align=left&display=inline&height=53&margin=%5Bobject%20Object%5D&name=image.png&originHeight=53&originWidth=529&size=5768&status=done&style=none&width=529)

npm version <update_type> 更新本地包版本

其中 update_type 有三个值：

patch（打补丁，版本会从 1.0.0 更新到 1.0.1，只是第三位增长）

minor（小修改，版本会从 1.0.0 更新到 1.1.0，更新的是第二位）

major（较大的改动，版本从 1.0.0 更新到 2.0.0，更新的是第一位）

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594796116932-ed1d75be-0f19-4bb5-befc-1f44603fbd40.png#align=left&display=inline&height=98&margin=%5Bobject%20Object%5D&name=image.png&originHeight=98&originWidth=547&size=9486&status=done&style=none&width=547)

当我们要更新包时，先将代码修改完毕，然后执行 npm version <update_type>
然后发布 npm publish 即可。

### 如何删除包？

``` bash
npm unpublish [<@scope>/]<pkg>@<version> // 删除某个版本的包
npm unpublish [<@scope>/]<pkg> --force // 删除整个包
```

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594795408154-cd4e647c-ea5e-4e2d-b1f5-002413adeb02.png#align=left&display=inline&height=225&margin=%5Bobject%20Object%5D&name=image.png&originHeight=225&originWidth=483&size=21086&status=done&style=none&width=483)![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594795266023-ad86dc98-19f9-4824-aa5d-3425216cec7b.png#align=left&display=inline&height=864&margin=%5Bobject%20Object%5D&name=image.png&originHeight=864&originWidth=1920&size=95952&status=done&style=none&width=1920)

### 项目用 github 托管

多人合作或者你想做代码版本控制，那么你就需要有一个地方可以长期稳定的存储你的代码，你需要建一个 git 仓库来存放，可以自行选择一个平台（githug、gitlab 等），这里我们推荐[github](https://github.com/)，如果你还没有账号，那么快去注册一个吧！

01. 注册 githug 账号，登录，新建一个 git 仓库
02. 在 npm-libs 文件夹下 `git init` ，初始化当前目录作为 git 仓库
03. 添加目录下的文件到本地仓库 `git add .`
04. 提交 `git commit -m "init commit"`
05. 添加远程仓库地址 `git remote add origin <从git仓库上拷贝下来的下载地址，粘贴在这里>` ，添加成功后，可以用 `git remote -v` 查看远程仓库地址
06. push 本地代码到远程 git 仓库 `git push --set-upstream origin master`
   - --set-upstream 简写 -u 本地分支关联远程分支

07. 结束

### 小结

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594794671558-a984164c-9a1f-4cd2-9ce5-62dbd00d84a8.png#align=left&display=inline&height=413&margin=%5Bobject%20Object%5D&name=image.png&originHeight=413&originWidth=468&size=31779&status=done&style=none&width=468)

## 搭建私有库平台

在前端/Nodejs 开发中我们通常会开发出公共的 module，但在企业开发功能模块时并不希望将自己的核心代码发布到 [npmjs.org](https://www.npmjs.com/) 中，虽然 npmjs.org 提供了私有的方法，更多企业还是倾向将代码控制在内网环境中，今天我们来介绍一下 npm 私有模块的 3 种主流方法。

### 方法一：git+npm link

npm install 除了日常使用的下面这些方式外

``` bash
npm install (with no args, in package dir)
npm install [<@scope>/]<name>
npm install [<@scope>/]<name>@<tag>
npm install [<@scope>/]<name>@<version>
npm install [<@scope>/]<name>@<version range>

aliases: npm i, npm add
common options:
[-P|--save-prod|-D|--save-dev|-O|--save-optional] [-E|--save-exact][-B|--save-bundle]
[--no-save] [--dry-run]
```

还有下面这些

``` bash
npm install <git-host>:<git-user>/<repo-name>
npm install <git repo url>
npm install <tarball file>
npm install <tarball url>
npm install <folder>
```

For example:

``` bash
npm install git+https://github.com/kongmengqian/npm-my-libs.git
```

执行过程&结果

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594819826539-d5f404b7-ddb5-431a-9a64-421aa96272fb.png#align=left&display=inline&height=710&margin=%5Bobject%20Object%5D&name=image.png&originHeight=710&originWidth=1429&size=106579&status=done&style=none&width=1429)

再用 npm link 来做包的调试，具体见【调试】章节

### 方法二：CNPM 私服

见[npm 私有模块的 3 种方法](https://www.jianshu.com/p/a9540d9f8d9c)

### 方法三：verdaccio

见[verdaccio 的 github](https://github.com/verdaccio/verdaccio)

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594821423953-e80b42b5-7a8a-468b-b185-98cc4cfd8e20.png#align=left&display=inline&height=724&margin=%5Bobject%20Object%5D&name=image.png&originHeight=724&originWidth=1452&size=86614&status=done&style=none&width=1452)

#### 包源管理

推荐用[nrm](https://github.com/Pana/nrm)管理 npm 包源，当然，手动操作也是可以的，[参考](https://docs.npmjs.com/misc/config#registry)。

``` bash
# 安装nrm
npm i nrm -g

# 查看可用包源
nrm ls

# 添加verdaccio包源，别名strong(按个人习惯定义)
nrm add strong http://yourweb:yourhost/

# 切换到verdaccio包源，切换一次，终身有效
nrm use strong

# 注册一个用户，然后愉快的开始npm操作
npm adduser
```

### 方法四：Nexus 私服

见[npm 私有模块的 3 种方法](https://www.jianshu.com/p/a9540d9f8d9c)

#### 小技巧：.npmrc

配置用户名、密码和 email，避免每次输入，提高效率，减少麻烦

后三种方式笔者没有尝试过，大家可以参考上述文章进行实践，后续笔者也会更新自己在实践过程中的经验。

## 多包管理

[Lerna](https://lernajs.bootcss.com/) 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目。
还需要知道 [npx](http://www.ruanyifeng.com/blog/2019/02/npx.html) 概念

## 调试

在/npm-libs-project 目录下，执行 npm link

``` bash
npm link (in package dir)
npm link [<@scope>/]<pkg>[@<version>]

alias: npm ln
```

yarn

``` bash
yarn link (in package dir)
yarn link [<@scope>/]<pkg>[@<version>]

yarn link <package_name>
yarn unlink <package_name>
```

For example:

``` bash
cd ~/npm-libs-project
yarn link
cd ~/dev-project
yarn link npm-libs-project
```

Now, any changes to ~/npm-libs-project will be reflected in ~/dev-project/node_modules/npm-libs-project/. Note that the link should be to the package name, not the directory name for that package.

npm 包目录下：~/npm-libs-project

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594799362472-91221e11-43a2-4d15-9bcf-a887facc386f.png#align=left&display=inline&height=238&margin=%5Bobject%20Object%5D&name=image.png&originHeight=238&originWidth=726&size=21495&status=done&style=none&width=726)

项目目录下：~/dev-project

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594799300329-1519fd3e-fbfc-4c14-be7f-256c2c7ece61.png#align=left&display=inline&height=237&margin=%5Bobject%20Object%5D&name=image.png&originHeight=237&originWidth=752&size=20633&status=done&style=none&width=752)

其他操作可以参考 npm-link

## 参考文章

* [npm 发布自己的库](https://www.cnblogs.com/xguoz/p/12498960.html)（快速入门板块内容参考的是这篇文章）
* [npm 私有模块的 3 种方法](https://www.jianshu.com/p/a9540d9f8d9c)（npm 包存放的平台）
* [npm 命令行传送门](https://docs.npmjs.com/cli-documentation/cli)

## 知识拓展

01. npm init 还有哪些用法和用途？

* [npm-init](https://docs.npmjs.com/cli/init.html)(npm init 后面可以带哪些参数，都是什么含义——实际应用：npm init react-app my-app 调用 create-react-app 脚手架创建一个名为 my-app 的项目)

02. package.json 配置项都有哪些？都是什么含义？

* [npm-package.json](https://docs.npmjs.com/files/package.json)

03. npm 其他的命令的学习

* [npm-version](https://docs.npmjs.com/cli/version)
* [npm-scope](https://docs.npmjs.com/misc/scope)
* [npm-publish](https://docs.npmjs.com/cli/publish)
* [npm-link](https://docs.npmjs.com/cli/link.html)
* [npm 命令行传送门](https://docs.npmjs.com/cli-documentation/cli)（[yarn 命令传送门](https://yarn.bootcss.com/docs/cli/)）
