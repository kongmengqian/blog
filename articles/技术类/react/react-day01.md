# react-day01

- 组件思想
- 单向数据流
- 函数式编程
- 只做一件事情

## JSX

- Babel 会把 JSX 转译成一个名为`React.createElement()`函数调用

```js
//type可以是 React.fragment <></> | HTML标签 '<div>' | 组件类型 '<HelloMessage />'
React.createElement(type, [props], [...children]);
```

以下两种示例代码完全等效：

```js
var element = (
  <div className="item" key={item.id}>
    <p>内容是：{item.content}</p>
  </div>
);
```

```js
React.createElement(
  "div",
  {
    className: "item",
    key: item.id,
  },
  React.createElement("p", null, "\u5185\u5BB9\u662F\uFF1A", item.content)
);
// 中文会编译成unicode代码
```

完整的示例：

```js
class HelloMessage extends React.Component {
  render() {
    [
      { content: "first", id: "1" },
      { content: "second", id: "2" },
    ].map((item) => {
      return (
        <div clasName="item" key={item.id}>
          <p>内容是：{item.content}</p>
        </div>
      );
    });
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" className="aa" />,
  document.getElementById("hello-example")
);

// Babel编译后
class HelloMessage extends React.Component {
  render() {
    [
      {
        content: "first",
        id: "1",
      },
      {
        content: "second",
        id: "2",
      },
    ].map((item) => {
      return /*#__PURE__*/ React.createElement(
        "div",
        {
          clasName: "item",
          key: item.id,
        },
        /*#__PURE__*/ React.createElement(
          "p",
          null,
          "\u5185\u5BB9\u662F\uFF1A",
          item.content
        )
      );
    });
  }
}

ReactDOM.render(
  /*#__PURE__*/ React.createElement(HelloMessage, {
    name: "Taylor",
    className: "aa",
  }),
  document.getElementById("hello-example")
);
```

- JSX 防止注入攻击

React DOM 在渲染所有输入内容之前，默认会进行**转义**。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 XSS（cross-site-scripting, 跨站脚本）攻击。

## 元素渲染

react 只更新它需要更新的部分

## 事件处理

当你使用 ES6 class 语法定义一个组件的时候，通常的做法是将事件处理函数声明为 class 中的方法

```js
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      isToggleOn: !state.isToggleOn,
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? "ON" : "OFF"}
      </button>
    );
  }
}

ReactDOM.render(<Toggle />, document.getElementById("root"));
```

## 状态提升

- 虽然提升 state 方式比双向绑定方式需要编写更多的“样板”代码，但带来的好处是，排查和隔离 bug 所需的工作量将会变少
- 如果某些数据可以由 props 或 state 推导得出，那么它就不应该存在于 state 中。
