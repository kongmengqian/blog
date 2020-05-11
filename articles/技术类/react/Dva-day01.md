# 复习 Dva-01

## 知识点

### Dva

#### Models

- state: `type State = any`表示 Models 的状态数据，可以通过 dva 的实例属性`_store`看到顶部的 state 数据

```js
const app = dva();
const store = app._store; // 顶部的 state 数据
```

- Action: `type AsyncAction = any`是个对象，是改变 state 唯一途径。通过 dispatch 函数调用一个 action，从而改变数据，必须要有一个 type 属性来指明具体的行为，其他字段可以随意定义，一般要更新的数据会放在`payload`这个属性中。
- dispatch:`type dispatch = (a: Action) => Action` 触发 action 的方式

```js
props.dispatch({
  type: "[namespace]/add", // 如果在model外调用，需要添加 namespace
  payload: {}, // 需要传递的信息
});
```

- Reducer:`type Reducer<S, A> = (state: S, action: A) => S` 描述如何改变数据，返回新 state，同步

```js
export default {
  ...
  reducers: {
    add(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  ...
};
```

- Effect: 接口请求，处理异步, 用 Generator 函数将异步转成同步写法，从而将 effects 转成纯函数写法

```js
// model文件
function query(params){
  // 接口请求
  return post('/url', params)
}
export default {
  ...
  // [namespace] 表示 model 里面的 namespace 值
  effects: {
    *fetch({payload}, {select, call, put}){

      // select 可以用来访问其它 model，一般用来获取state
      const state = yield select(({[namespace]})=> [namespace]);

      // call(fn, ...args) 是调用执行一个函数，一般是调用接口，异步请求
      const data = yield call(query, params);

      //  put 相当于 dispatch 执行一个 action
      yield put({
        type:'[namespace]/add',
        payload:{
          ...data
        }
      })
    }
  }
  ...
}
```

- Subscription: 订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

```js
export default {
  ...
  subscriptions:{
    setup({dispatch, history}, error){
      // 监听路由变化
      history.listen((location) => {
        if(location.pathname === '/user'){
          dispatch({
            type:'save',
            payload:{}
          })
        }
      })
    }
  }
  ...
}


```

#### Router

dva 实例提供了 router 方法来控制路由，使用的是 react-router

```js
import {Router, Route} from 'dva/router';
import exampleModal from './models/example';
import IndexPage from './routes/IndexPage';

// init
const app = dva();

// Plugins
// app.use({});

// Model
app.modal(exampleModal);

// Router
// 一般会把router单独写在一个文件里
app.router(({ history }) => {
  return (
    <Router history={history}>
      <Route path='/' component={IndexPage}>
    </Router>
  )
});

// Start
app.start('#app');
```

把 router 独立为一个文件

```js
// router.js
import {Router, Route} from 'dva/router';
import IndexPage from './routes/IndexPage';

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Route path='/' component={IndexPage}>
    </Router>
  )
}
export default RouterConfig;
```

```js
// index.js 入口文件
import dva from "dva";
import exampleModal from "./models/example";
import exampleRouter from "./router";

const app = dva();
// app.use({});
app.modal(exampleModal);
app.router(exampleRouter);
app.start("#app");
```

- Generator yield
- async/await

### 周边技术

`几个业务视图长得差不多，model也存在少量差别`

期望能够对 model 进行扩展，可以借助 dva 社区的[dva-model-extend]()库来做这件事

换个角度，也可以通过工厂函数来生成 model

```js
function createModel(options) {
  const { namespace, param } = options;
  return {
    namespace: `demo${namespace}`,
    states: {},
    reducers: {},
    effects: {
      *foo() {
        // 这里可以根据param来确定下面这个call的参数
        yield call();
      },
    },
  };
}

const modelA = createModel({ namespace: "A", param: { type: "A" } });
const modelB = createModel({ namespace: "A", param: { type: "B" } });
```

## 技术文章

- [Dva 概念](https://dvajs.com/guide/concepts.html#models)(主要就是对它的理解)
- [Generator 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/04/generator.html)(简单解读-举例子式)
- [Generator 函数的语法-ES6](https://es6.ruanyifeng.com/#docs/generator)(详细解读-教科书式)
- [async/await](http://www.ruanyifeng.com/blog/2015/05/async.html)(简单解读-举例子式)
- [redux-sagas | Effect](https://redux-saga-in-chinese.js.org/docs/basics/DeclarativeEffects.html)
- [组件设计方法](https://github.com/dvajs/dva-docs/tree/master/v1/zh-cn/tutorial)
- [函数式编程指南](https://legacy.gitbook.com/book/llh911001/mostly-adequate-guide-chinese/details)
