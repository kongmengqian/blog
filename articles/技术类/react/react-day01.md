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

## React 中 setState 什么时候是同步的，什么时候是异步的？

在 React 中，如果是由 React 引发的事件处理（比如通过 `onClick` 引发的事件处理），调用 `setState` 不会同步更新 `this.state`，除此之外的 `setState` 调用会同步执行 `this.state`。所谓“除此之外”，指的是绕过 React 通过 `addEventListener` 直接添加的事件处理函数，还有通过 `setTimeout/setInterval` 产生的异步调用。

原因： 在 React 的 `setState` 函数实现中，会根据一个变量 `isBatchingUpdates` 判断是直接更新 `this.state` 还是放到队列中回头再说，而 `isBatchingUpdates` 默认是 `false`，也就表示 `setState` 会同步更新 `this.state`，但是，有一个函数 `batchedUpdates`，这个函数会把 `isBatchingUpdates` 修改为 `true`，而当 React 在调用事件处理函数之前就会调用这个 `batchedUpdates`，造成的后果，就是由 React 控制的事件处理过程 `setState` 不会同步更新 `this.state`。

## 为什么列表元素上要添加 key 属性

> 当有 key 时，react 使用 key 来匹配原有树的子元素和最新树的子元素，使得原来低效转换变得高效。

在原有树的子节点和最新树的子节点进行对比的时候，key 作为一个唯一标识，react 认为拥有相同 key 的元素无需再创建，只需要移动位置即可，因此减少了一些不必要的开销，提高了性能。

## 高阶组件

> 高阶函数是参数为组件，返回值为新组件的函数

原则

- 不要改变原始组件，组合组件

约定

- 将不想关的 props 传递给被包裹的组件，即被透传的永远是被包裹的组件需要的 props
- 最大化可组合性，即尽可能是这样的模式：`Component => Component`，输出类型与输入类型相同的函数很容易组合在一起
- 包装显示名称以便轻松调试

注意

- 不要在 render 方法中使用 HOC
- 务必复制静态方法
- refs 不会被传递

---

## hook

### 有什么是 Hook 能做而 class 做不到的？

Hook 提供了强大而富有表现力的方式来在组件间复用功能，通过自定义 Hook 可以在**无需修改组件结构**的前提下，把组件逻辑提取到可重用的函数中，其实就是**重用状态逻辑**

两个组件之间有相同的状态逻辑的话，没有 Hook 之前可以用 render props 以及高阶组件。

自定义 Hook 解决了以前在 React 组件中无法灵活共享逻辑的问题。

### 不要在循环、嵌套或条件函数中调用 Hook

Hook 在每一次渲染中都保持同样的顺序被调用，才能确保 state 正确。react 怎么知道哪个 state 对应哪个 useState？答案是 react 靠的是 hook 调用的顺序。一个函数组件内部会有多个 useState 和 useEffect 的调用，这些状态是按调用顺序被记录在一个数组里面，一旦 hook 的渲染顺序出错，维护状态的数组是无法得知最新的渲染顺序，从而出现错误读取，产生 bug。

### React 是如何把对 Hook 的调用和组件联系起来的？

每个组件内部都有一个 **「记忆单元格」列表**。它们只不过是我们用来存储一些数据的 JavaScript 对象。当你用 useState() 调用一个 Hook 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），然后把指针移动到下一个。这就是多个 useState() 调用会得到各自独立的本地 state 的原因。

---

## hook 与 class 之间的区别

### Hooks 与 Class 中调用 `setState` 有不同的表现差异么？

有点区别的，主要是 class 里面的 `setstate` 是有一个合并的 merge 操作，hooks 是利用闭包，直接进行值的替换，所以在用 hooks，尽量多用 `useReducer`，一次性改变数据，毕竟多次 `setstate` 触发多次渲染，影响性能。

与在类中使用 setState 的异同点：

- 相同点：也是异步的，例如在 onClick 事件中，调用两次 setState，数据只改变一次。

- 不同点：类中的 setState 是合并，而函数组件中的 setState 是替换。

- 当 state 状态值结构比较复杂时，使用 useReducer 更有优势。

- 使用 useState 获取的 setState 方法更新数据时是异步的；而使用 useReducer 获取的 dispatch 方法更新数据是同步的。

## useRef

本质上，useRef 就像是可以在其 .current 属性中保存一个可变值的“盒子”。

useRef() 比 ref 属性更有用。它可以很方便地保存任何可变值，其类似于在 class 中使用实例字段的方式。

这是因为它创建的是一个普通 Javascript 对象。而 useRef() 和自建一个 {current: ...} 对象的唯一区别是，useRef 会在每次渲染时返回同一个 ref 对象。所以在异步回调中可以做到读取最新的 state，这也是因为 ref 是一个 object 类型，是引用类型数据，读取的永远是指针指向的地址。

如果你刻意地想要从某些异步回调中读取 最新的 state，你可以用 [一个 ref](https://react.docschina.org/docs/hooks-faq.html#is-there-something-like-instance-variables) 来保存它，修改它，并从中读取。
