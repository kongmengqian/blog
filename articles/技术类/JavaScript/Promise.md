# Promise

> 异步编程的一种解决方案，将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数，解决了回调地狱问题，在编写上更易维护。

**Promise 对象的特点**

- 对象的状态不受外界的影响。有三种状态：`pending`(进行中)，`fulfilled`（已成功），`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
- 一旦状态改变就不会再变，你再对`Promise`对象添加回调函数，也会立即得到这个结果。

**Promise 的缺点**

- 无法取消`Promise`，一旦新建就会执行
  示例：
  > 这边涉及到了事件循环机制的知识点，Promise 属于微任务，在所有宏任务执行完成后再执行，具体可以看[事件循环机制篇](./事件循环机制.md)

```js
let promise = new Promise(function (resolve, reject) {
  // 建立就会执行
  console.log("Promise");
  // 异步任务要等到同步任务都执行结束后再执行
  resolve();
});

// 立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
promise.then(function () {
  console.log("resolved.");
});

console.log("Hi!");

// Promise
// Hi!
// resolved
```

- 如果不设置回调函数，`Promise`内部抛出的错误不会反应到外部，通俗的讲“`Promise`会吃掉错误”(意思说一定要使用`catch()`来捕获 Promise 对象的错误)
- 当处于`pending`状态的时候，无法得知当前进展到哪一阶段（刚刚开始，还是快完成了）

**基本用法**

- `Promise.prototype.tnen()`方法可以传两个参数，`then`方法的第一个参数是`resolved`状态的回调函数，第二个参数（可选）是`rejected`状态的回调函数。`then`方法返回的是一个新的`Promise`实例，所以可以`.then().then()`的链式写法。
- `Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数，所以`cahch()`也会返回一个新的`Promise`实例可以`.chach().then()`的链式写法。
- `Promise`对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。一般来说，不要在`then()`方法里面定义 `Reject`状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。

```js
const promise = new Promise((resolve, reject) => {
 if(/*异步操作成功*/){
   resolve(data)
 }else{
   reject(err)
 }
})
// good
promise.then((data) => {
  // success todo
  ...
}).catch((err) => {
 // error todo
 ...
});

// 等同于 bad
// promise.then((data) => {
//   // success todo
//   ...
// }, (err) => {
//   // error todo
//   ...
// });


```

## Promise 常用函数

- `Promise.prototype.finally()`用于指定不管 `Promise` 对象最后状态如何，都会执行的操作，即成功或失败的时候都要执行的操作，本质是`then()`方法的特例，有了`finally()`后可以只写一次。`finally`方法总是会返回原来的值（不懂这个可以用来做什么？）。

```js
promise.finally(() => {
  // 语句
});

// 等同于
promise.then(
  (result) => {
    // 语句
    return result;
  },
  (error) => {
    // 语句
    throw error;
  }
);
```

`finally()`的实现原理

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason;
      })
  );
};
```

- `Promise.all()`用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。只有传入的所有的`Promise`状态都变成`fulfilled`或者其中有一个变成`rejected`才执行`Promise.all`方法后面的`.then()`的回调函数。**如果作为参数的 Promise 实例，自己定义了 catch 方法，那么它一旦被 rejected，并不会触发 Promise.all()的 catch 方法**(用 all 的方法的时候需要注意一下这个点，用是简单的，在复杂场景下调用我容易搞糊涂，知道这个知识点，遇到 bug 能联想到就 ok)。

```js
const p = Promise.all([p1, p2, p3]);
```

场景：初始化页面的时候需要等所有接口（无先后顺序）都调用成功后再展示页面，在此之前显示 loading，就可以用`Promise.all()`来实现。

```js
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON("/post/" + id + ".json");
});

Promise.all(promises)
  .then(function (posts) {
    // ...
  })
  .catch(function (reason) {
    // ...
  });
```

p 的状态由 p1、p2、p3 决定，分成两种情况。

（1）只有 p1、p2、p3 的状态都变成`fulfilled`，p 的状态才会变成`fulfilled`，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数。(<font color="#b7eb8f">_大家好才是真的好_</font>)

（2）只要 p1、p2、p3 之中有一个被`rejected`，p 的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给 p 的回调函数。(<font color="#b7eb8f">一颗老鼠屎坏了一锅粥</font>)

- `Peomise.race()`同样是将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。与`all()`相反，只要传入的`Promise`中有一个状态发生改变，就会执行`race()`后面的`.then()`回调函数。（<font color="#b7eb8f">只要有一个项目投资成功了，就是赚了</font>）

```js
const p = Promise.race([p1, p2, p3]);
```

场景：控制接口请求超时，用`race()`方法也可以做到

```js
const p = Promise.race([
  fetch("/resource-that-may-take-a-while"),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error("request timeout")), 5000);
  }),
]);

p.then(console.log).catch(console.error);
```

- `Promise.allSettled()`与`Promise.all()`类似，区别是，传入的`Promise`实例需要都返回结果，无论是`fulfilled`还是`rejected`，也就是所有的`Promise`都会走完，都有结果。
- `Promise.any()`与`Promise.race()`类似，区别是，传入的`Promise`实例有状态发生了改变，如果变成的是`fulfilled`，那么就执行回调函数；如果变成的是`rejected`，那么需要都变成`rejected`的状态，才会执行`.any()`后面的回到函数。也就是说，如果一直都没有出现`fulfilled`状态，即便出现了一个`rejected`状态也仍然要把所有的其他`Promise`实例都执行完成才可以执行回调函数。

  > `Promise.any()`抛出的错误，不是一个一般的错误，而是一个 `AggregateError` 实例。它相当于一个数组，每个成员对应一个被`rejected`的操作所抛出的错误。

`Promise.any()`示例

```js
var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);
Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  console.log(result); // 42
});
Promise.any([rejected, alsoRejected]).catch(function (results) {
  console.log(results); // [-1, Infinity]
});
```

- `Promise.resolve()`现有对象转为 `Promise` 对象，`Promise`属于微任务，在本轮事件循环的结束时执行，可以利用这个机制，在特殊的阶段执行，从而达到某种目的。

```js
const jsPromise = Promise.resolve($.ajax("/whatever.json"));
```

`Promise.resolve()`等价于下面的写法

```js
Promise.resolve("foo");
// 等价于
new Promise((resolve) => resolve("foo"));
```

又涉及到事件循环机制啦啦啦啦~

```js
setTimeout(function () {
  console.log("three");
}, 0);

Promise.resolve().then(function () {
  console.log("two");
});

console.log("one");

// one
// two
// three
```

上面代码中，`setTimeout(fn, 0)`在下一轮“事件循环”开始时执行，`Promise.resolve()`在本轮“事件循环”结束时执行，`console.log('one')`则是立即执行，因此最先输出。

- `Promise.reject()`也会返回一个新的 `Promise` 实例，该实例的状态为`rejected`。

```js
const p = Promise.reject("出错了");
// 等同于
const p = new Promise((resolve, reject) => reject("出错了"));
```

> 注意，`Promise.reject()`方法的参数，会原封不动地作为 `reject` 的理由，变成后续方法的参数。这一点与 `Promise.resolve` 方法不一致。

```js
const thenable = {
  then(resolve, reject) {
    reject("出错了");
  },
};

Promise.reject(thenable).catch((e) => {
  console.log(e === thenable);
});
// true
```

- `Promise.try()`同步任务就同步执行，异步任务可以在该方法后面的`.then()`里面用回调函数处理，开发者不需要关心`Promise`中包装的是同步代码还是异步代码（个人理解）
  > 实际开发中，经常遇到一种情况：不知道或者不想区分，函数 `f` 是同步函数还是异步操作，但是想用 `Promise` 来处理它。因为这样就可以不管 `f` 是否包含异步操作，都用 `then` 方法指定下一步流程，用 `catch`方法处理`f` 抛出的错误。可以用`Promise.resolve().then(f).catch((err)=>{})`但是有个缺点，如果 `f` 是同步函数，那么它会在本轮事件循环的末尾执行，`f`函数明明是同步的，被`Peomise`包装之后就变成了异步了，那么有没有什么方法可以让**同步函数同步执行，异步函数异步执行**？有，那就是`Promise.try()`——摘自阮一峰 ES6（书上有详细的发展和演变说明，这边就简单的摘抄了起因和结果）

```js
// 第一种写法
const f = () => console.log("now");
(async () => f())()
  .then(() => {
    // success
  })
  .catch(() => {
    // error
  });
console.log("next");
// now
// next

// 第二种写法
const f = () => console.log("now");
(() => new Promise((resolve) => resolve(f())))();
console.log("next");
// now
// next

// 第三种写法
const f = () => console.log("now");
Promise.try(f);
console.log("next");
// now
// next
```

```js
try {
  database.users.get({id: userId})
  .then(...)
  .catch(...)
} catch (e) {
  // ...
}
// 等同于 好处-其中一点是可以更好地管理异常
Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...)
```

#### 遗留问题

- `Promise`的错误捕捉需要再理解梳理一下

## 参考资料

- [阮一峰 es6 中的 Promise 章节](https://es6.ruanyifeng.com/#docs/promise)
