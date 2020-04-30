# 记录 wechaty 的使用

> 2019-06-06 15:56

### 搭建 wechaty 运行环境

1. 从 GitHub 上下载[wechaty-getting-started](https://github.com/wechaty/wechaty-getting-started)这个项目
1. 在项目 wechaty-getting-started 目录下 执行 npm install 安装所需依赖
1. 在当前目录下执行 npm start 运行项目
1. 将 web 升级到 ipad 版 在当前目录下 执行 npm install wechaty-puppet-padchat
1. 可以会遇到下面的错误，需要安装  [ python](https://www.python.org/downloads/release/python-2716/) 和 [node-gyp](https://github.com/nodejs/node-gyp)（需要全局安装 npm install -g node-gyp）

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
- 上面的执行成功之后，重新 npm install wechaty-puppet-padchat

6. 把之前 examples/starter-bot.js 里面的代码替换成下面的

```javascript
//port { Wechaty } from 'wechaty' // 我使用这个会报错，就用了require引入
const { Wechaty } = require("wechaty");

// 替换成你的测试token
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

参考资料

- [如何用 6 行代码写出微信聊天机器人——李佳芮](https://lijiarui.github.io/chatbot/2016-11-20-wechaty-wuli-usecase.html)
- [李佳芮 github](https://github.com/lijiarui)
- [github 上的](https://github.com/nodejs/node-gyp)[node-gyp](https://github.com/nodejs/node-gyp)[文档](https://github.com/nodejs/node-gyp)
- [python2.7.x 官网下载地址](https://www.python.org/downloads/release/python-2716/)
- [桔子互动官网](https://www.botorange.com/)
- [wechaty 官网](https://docs.chatie.io/v/zh/)
