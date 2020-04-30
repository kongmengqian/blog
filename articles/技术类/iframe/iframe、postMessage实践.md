# iframe、postMessage 实践

> 2019-12-06 14:43

# postMessage [API 说明](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)

摘抄：
window.postMessage() 方法可以安全地实现跨源通信。即可以在两个窗口之间互相通信。
前提：执行他们的页面位于具有相同的协议（通常为 https）、端口号、主机（域名，两个页面的 domain 设置为相同的值）
![image.png](https://cdn.nlark.com/yuque/0/2019/png/274409/1575603955381-77ef5a68-65d6-44a7-8193-285853c5f075.png#align=left&display=inline&height=421&name=image.png&originHeight=421&originWidth=1679&size=151131&status=done&style=none&width=1679)

_**otherWindow.postMessage(message, targetOrigin, [transfer]);**_

**otherWindow **
其他窗口的一个引用，比如 iframe 的 contentWindow 属性、执行[window.open](https://developer.mozilla.org/en-US/docs/DOM/window.open)返回的窗口对象、或者是命名过或数值索引的[window.frames](https://developer.mozilla.org/en-US/docs/DOM/window.frames)。

**message**
将要发送到其他  window 的数据。它将会被[结构化克隆算法](https://developer.mozilla.org/en-US/docs/DOM/The_structured_clone_algorithm)序列化。这意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化。并不是所有浏览器都做到了这点儿，部分浏览器只能处理字符串参数，所以我们在传递参数的时候需要**使用 JSON.stringify()方法对对象参数序列化**，在低版本 IE 中引用 json2.js 可以实现类似效果。

**targetOrigin**
通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"_"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；例如，当用 postMessage 传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的 origin 属性完全一致，来防止密码被恶意的第三方截获。\*\*如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 targetOrigin，而不是_。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。**
\*\***transfer【可选】\*\*
是一串和 message 同时传递的  [`Transferable`](https://developer.mozilla.org/zh-CN/docs/Web/API/Transferable)  对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

# 发消息

父窗口.html

```html
<iframe id="child0" src="./child0.html"></iframe>
<iframe id="child" src="./child.html"></iframe>
<iframe id="child1" src="./child1.html"></iframe>
<script>
  // 一定要页面加载完
  window.onload = function () {
    //  索引查找，页面中只有1个iframe的时候简单方便
    // window.frames[0].postMessage(
    //   JSON.stringify({
    //     type: 'AsendB',
    //     initFollowData: "我给你发消息了哦！"
    //    }),
    //   '*'
    //  );

    // 页面中有多个iframe的话，就不能再用数值索引来找我想要发消息的iframe了
    window.frames["child"].contentWindow.postMessage(
      JSON.stringify({
        type: "AsendB",
        initFollowData: "我给你发消息了哦！",
      }),
      "*"
    ); // 非IE内核
    //window.frames["child"].postMessage('This is data','*'); // IE内核
  };
</script>
```

# 收消息

child.html（子窗口）

```html
<script>
  // 收消息
  window.addEventListener(
    "message",
    function (messageEvent) {
      console.log(messageEvent);
      const data = JSON.parse(messageEvent.data);
    },
    false
  );
</script>
```

# 其他

#### 1. 在主页面，想操作子页面的 DOM 元素

> contentWindow 兼容各个浏览器，可取得子窗口的 window 对象。
> contentDocument Firefox 支持，> ie8 的 ie 支持，可取得子窗口的 document 对象。

父窗口.html

```html
<iframe id="child" src="./child.html"></iframe>
<script>
  var getIframeDoc = function (ifr) {
    return ifr.contentDocument || ifr.contentWindow.document;
  };
  var ifr = document.getElementById("child"); // 获取子窗口iframe对象
  var ifrDocument = getIframeDoc(ifr); // 获取子窗口的document，之后就可以对子窗口的元素操作了
</script>
```

#### 2. 在子页面，想操作父页面的 DOM 元素

child.html（子窗口）

```html
<script>
  var ifr = document.getElementByTagName("iframe");
  ifr.parent.document.getElementById("div1");
</script>
```

# [iframe 介绍](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe)

内联框架元素，可以将另一个 HTML 页面嵌入到当前页面中

```html
<iframe src="url" title="this is a new html" width="300" height="200"> </iframe>
```

#

# 感受

多个窗口之间需要通信的时候，搞清楚发、收，一一对应，理清楚就没什么难度。对敏感数据一定要考虑一下安全性，多加一些判断。
