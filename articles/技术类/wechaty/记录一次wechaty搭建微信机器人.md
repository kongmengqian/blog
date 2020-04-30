# 记录一次 wechaty 搭建微信机器人

> 2019-08-28 19:35

### 搭建 wechaty 运行环境

1. 从 GitHub 上下载[wechaty-getting-started](https://github.com/wechaty/wechaty-getting-started)这个项目
1. 在项目 wechaty-getting-started 目录下 执行 npm install 安装所需依赖
1. 在当前目录下执行 npm start 运行项目
1. ~~将 web 升级到 ipad 版 在当前目录下 执行 npm install wechaty-puppet-padchat（不再维护了）~~
1. 将 web 升级到 ipad 版 在当前目录下 执行 wechaty-puppet-padpro
1. 可以会遇到下面的错误，需要安装  [ python](https://www.python.org/downloads/release/python-2716/)  和  [node-gyp](https://github.com/nodejs/node-gyp)（需要全局安装 npm install -g node-gyp）

![image.png](https://cdn.nlark.com/yuque/0/2019/png/274409/1559804470902-11f24894-5e22-47a3-a0e7-1c720deee19f.png#align=left&display=inline&height=582&name=image.png&originHeight=582&originWidth=967&size=57566&status=done&width=967)

- 安装 python
  - 选择 2.7.x 版![](https://cdn.nlark.com/yuque/0/2019/png/274409/1559805097499-80d28119-6b80-4b16-91f6-a60ce276286c.png#align=left&display=inline&height=453&originHeight=854&originWidth=1406&status=done&width=746)
    > **问：为什么这边要选择 2.7.x 的版本呢？** > **答：因为 node-gyp 的安装，\*\***不支持\***\*`v3.x.x`\*\***  版本，详见**[**node-gyp**](https://github.com/nodejs/node-gyp)**说明文档\*\*

![image.png](https://cdn.nlark.com/yuque/0/2019/png/274409/1559806186808-aa5b3e70-c15b-4f74-baae-d160b94c866b.png#align=left&display=inline&height=949&name=image.png&originHeight=949&originWidth=989&size=106145&status=done&width=989)

- 安装  npm install --global --production windows-build-tools

需要用管理员身份运行
![image.png](https://cdn.nlark.com/yuque/0/2019/png/274409/1559806406576-af876d46-2833-4958-a493-e3980a0d05c7.png#align=left&display=inline&height=697&name=image.png&originHeight=865&originWidth=416&size=88646&status=done&width=335)

如下所示，需要一定的安装时间，耐心等候![image.png](https://cdn.nlark.com/yuque/0/2019/png/274409/1559806312533-ca72bb6b-5c15-4340-9990-ff7e2feacd41.png#align=left&display=inline&height=571&name=image.png&originHeight=571&originWidth=842&size=468111&status=done&width=842)

- 安装  npm install node-gyp --save
- ~~上面的执行成功之后，重新 npm install wechaty-puppet-padchat(这个已经不维护了)~~
- 上面的执行成功之后，重新 npm install wechaty-puppet-padpro

6. 把之前 examples/starter-bot.js 里面的代码替换成下面的

```javascript
//port { Wechaty } from 'wechaty' // 我使用这个会报错，就用了require引入
const { Wechaty } = require("wechaty");

// 替换成你的测试token：puppet_padchat_d53cd4cff253d8f6 只有7天有效期
const WECHATY_PUPPET_PADCHAT_TOKEN = "your-token-here";

const puppet = "wechaty-puppet-padchat"; // 使用ipad 的方式接入。

const puppetOptions = {
  token: WECHATY_PUPPET_PADCHAT_TOKEN,
};
// 设置name,它会自动生成一个叫做wechatyName.memory-card.json的文件，文件会存储机器人的登陆信息。
const bot = new Wechaty({
  name: "wechatyName",
  puppet,
  puppetOptions,
});

// 设置完成

// 运行 wechaty
bot
  .on("scan", (qrcode, status) =>
    console.log(
      `Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        qrcode
      )}`
    )
  )
  .on("login", (user) => console.log(`User ${user} logined`))
  .on("message", (message) => console.log(`Message: ${message}`))
  .start();
```

7. npm start
8. 如果还是安装有问题的话，或者安装成功了，但是启动的时候还是报错的话，可以删掉 node_modules 重新 npm install，下图是倩倩删除依赖重新安装，会去编译一些文件和模块

![image.png](https://cdn.nlark.com/yuque/0/2019/png/274409/1566990259756-c328be1d-b74a-4b6a-85cf-4229be6960a5.png#align=left&display=inline&height=839&name=image.png&originHeight=839&originWidth=993&size=87044&status=done&width=993)

安装编译成功之后：
![image.png](https://cdn.nlark.com/yuque/0/2019/png/274409/1566990704573-0b478c75-08c4-4ca0-8f3b-7006bace2f8b.png#align=left&display=inline&height=832&name=image.png&originHeight=832&originWidth=979&size=80930&status=done&width=979)

### 工具：

#### qrcode-terminal 

仅仅把需要扫描的二维码图片作为链接打印在屏幕上，复制链接到浏览器中再去扫描，依然很麻烦，我更希望在 terminal 上直接扫描二维码登陆进来，这样才能到达 demo 中的炫酷效果，只需要两步： 1.安装依赖包：
`npm install qrcode-terminal` 2.稍微修改下 scan 事件后的代码就可以了：

```javascript
bot.on("scan", (qrcode, status) => {
  require("qrcode-terminal").generate(qrcode, { small: true }); // show qrcode on console

  const qrcodeImageUrl = [
    "https://api.qrserver.com/v1/create-qr-code/?data=",
    encodeURIComponent(qrcode),
  ].join("");

  console.log(qrcodeImageUrl);
});
```

#### node-gyp（[https://www.npmjs.com/package/node-gyp](https://www.npmjs.com/package/node-gyp)）

GYP 是一种构建自动化工具。
node-gyp：node 下的 gyp。

Q：为什么要有 node-gyp？
A：因为 node 程序中需要调用一些其他语言编写的 工具 甚至是 dll，需要先编译一下，否则就会有跨平台的问题，例如在 windows 上运行的软件 copy 到 mac 上就不能用了，但是如果源码支持，编译一下，在 mac 上还是可以用的。node-gyp 在较新的 Node 版本中都是自带的（平台相关），用来编译原生 C++模块。

#### nosql-leveldb（[https://www.npmjs.com/package/nosql-leveldb](https://www.npmjs.com/package/nosql-leveldb)）

Q：什么是 leveldb？
A：leveldb 它是一个 NOSQL 存储引擎，它和 Redis 不是一个概念。Redis 是一个完备的数据库，而 LevelDB 它只是一个引擎。
 LevelDB 还可以将它看成一个 Key/Value 内存数据库。它提供了基础的 Get/Set API，我们在代码里可以通过这个 API 来读写数据。
你还可以将它看成一个无限大小的高级 HashMap，我们可以往里面塞入无限条 Key/Value 数据，只要磁盘可以装下。
node 环境中使用 leveldb 数据库的工具

#### node-pre-gyp（[https://www.npmjs.com/package/node-pre-gyp](https://www.npmjs.com/package/node-pre-gyp)）

介绍：node-pre-gyp 是一个分发 nodejs 二进制程序包的工具，负责将预编译好的二进制程序直接下载到用户目录。它介于 npm 与 node-gyp 之间，只在相应平台二进制包不存在时才调用 node-gyp 编译。
Q：node-pre-gyp 存在的意义是什么呢？
A：一些简单的 nodejs C++扩展直接从源代码编译安装问题不大，但复杂的扩展编译环境难搭建、编译耗时长，因而从源代码安装非常麻烦。node-pre-gyp 能够将预编译好的二进制包直接下载到用户目录，只在必要的时候才调用 node-gyp 从源代码编译，大大加快了 nodejs C++扩展的安装速度。
node-pre-gyp 需要开发者将各平台编译好的二进制包上传到网络上，并在 package.json 的`binary`字段指明二进制包的位置。然而，很多开发者选择将二进制包上传到 aws 上，导致国内无法正常下载（被墙）。幸好，可以在 npm 中设置`--{module_name}_binary_host_mirror`选项来指定二进制包的位置。

参考资料
[如何用 6 行代码写出微信聊天机器人——李佳芮](https://lijiarui.github.io/chatbot/2016-11-20-wechaty-wuli-usecase.html)
[李佳芮 github](https://github.com/lijiarui)
[github 上的](https://github.com/nodejs/node-gyp)[node-gyp](https://github.com/nodejs/node-gyp)[文档](https://github.com/nodejs/node-gyp)
[python2.7.x 官网下载地址](https://www.python.org/downloads/release/python-2716/)
[使用 node-pre-gyp 加速二进制包安装](http://jingsam.github.io/2017/01/12/node-pre-gyp-mirror.html?utm_source=tuicool&utm_medium=referral)
[桔子互动官网](https://www.botorange.com/)
[wechaty 官网](https://docs.chatie.io/v/zh/)
