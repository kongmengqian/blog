# javaScript 数据类型

> 2020-05-03 18:03

**6 种基本类型：** String Number Boolean Null Undefined Symbol(表示独一无二的值) 原始数据类型。存放在栈中简单数据段，占据空间小，大小固定。

**引用数据类型：** Array Object Function 存放在堆中，占据空间大，大小不固定，如果存放在栈中，会影响程序运行的性能，它在栈中存储了指针。当解析器寻找引用值时，会先检索在栈中的位置，取得地址后，从堆中获得实体。

**判断数据类型方法：** 最常用最全面最正确的判断方式是 `Object.prototype.toString.call(<T>)// '[object xxx]'` object 代表当前实例是对象数据类型，xxx 表示 this 所属的类是什么类型。

数组：

```js
Object.prototype.toString.call([]) // '[object Array]'
[] instanceof Array // true
[].slice // if([].slice){ 是数组 }
[].__proto__ === Array.prototype // true
Array.isArray([]); // ture 有兼容问题 ie9及以上才兼容
```

对象：

```js
Object.prototype.toString.call({}) // '[object Object]'
var a = {}; a.**proto** === Object.prototype // true
```

null：

```js
Object.prototype.toString.call(null); // '[object Null]'
var a = null;
a === null; // true
```

undefinde：

```js
Object.prototype.toString.call(undefinde); // '[object Undefinde]'
var a = undefinde;
typeof a; // 'undefinde'
```

typeof --> undefinde string number boolean function 是可以被区分出来的，array object，null 都是 object，需要用上述的方式去区分。

### 原理浅析

#### typeof

要想弄明白为什么 `typeof` 判断 `null` 为 `object`，其实需要从 js 底层如何存储变量类型来说其。虽然说，这是 JavaScript 设计的一个 bug。

在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 `0x00`），因此，`null` 的类型标签是 0，`typeof null` 也因此返回 "object"。曾有一个 ECMAScript 的修复提案（通过选择性加入的方式），但被拒绝了。该提案会导致 `typeof null === 'null'`。
js 在底层存储变量的时候，会在变量的机器码的低位 1-3 位存储其类型信息：

- 1：整数
- 110：布尔
- 100：字符串
- 010：浮点数
- 000：对象

但是，对于`undefined` 和`null`来说，这两个值的信息存储是有点特殊的：

- null：所有机器码均为 0
- undefined：用 −2^30 整数来表示

所以在用 typeof 来判断变量类型的时候，我们需要注意，最好是用 typeof 来判断基本数据类型（包括 symbol），避免对 null 的判断。

#### instanceof

`object instanceof constructor`

`instanceof` 和 `typeof` 非常的类似。`instanceof` 运算符用来检测 `constructor.prototype` 是否存在于参数 `object` 的原型链(即`object.__proto__`)上。与 `typeof` 方法不同的是，`instanceof` 方法要求开发者明确地确认对象为某特定类型。它可以判断一个实例是否是其父类型或者祖先类型的实例。

```js
// 内部判断方式
function instance_of(L, R) {
  //L 表示左表达式，R 表示右表达式
  var O = R.prototype; // 取 R 的显示原型
  L = L.__proto__; // 取 L 的隐式原型
  while (true) {
    if (L === null) return false;
    if (O === L)
      // 这里重点：当 O 严格等于 L 时，返回 true
      return true;
    L = L.__proto__;
  }
}
```

参考资料：

- [【THE LAST TIME】一文吃透所有 JS 原型相关知识点](https://juejin.im/post/5dba456d518825721048bce9)

**创建数据有哪些方式：**

```js
// 对象
var obj;
// 用字面量方式创建
obj = { a: 1 };
//  => 相当于下面这个写法
obj = Object.create(Object.prototype);
// 可传参数，不传的话，默认创建一个空对象，即{}
obj = new Object();
// 有兼容性，可传两个参数：proto：新创建对象的原型对象；propertiesObject：可选，具体看API文档
obj = Object.create({});
var obj1;
obj1 = Object.assign({}, obj); // 复制一个对象，浅拷贝
obj1 = { ...obj }; // 同上

// 数组
var a = [];
var b = new Array();
var c = [...new Set([])];
var d = Array.from(new Set([]));

// 字符串
var a = "hello worle";
var b = new String();

// 数字
var a = 1;
var b = new Number();

// 布尔值
var a = true;
var b = new Boolean();
```

Object.assign() 常见用法

```js
// 合并对象，且会合并相同属性的对象
var o1 = { a: 1 };
var o2 = { a: 11, b: 2 };
var o3 = { c: 3 };
var obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 11, b: 2, c: 3 }
console.log(o1); // { a: 11, b: 2, c: 3 }，注意目标对象自身也会改变
// 相当于下面的操作，指向的时同一个指针地址
o1 = { ...o1, ...o2, ...o3 };
obj = o1;

// 原始类型会被包装成对象
var a = "abc";
obj = Object.assign({}, a); // {0: 'a', 1: 'b', 2: 'c'}
obj = { ...a }; // 同上

// 拷贝Symbol类型属性
o1 = { a: 1 };
o2 = { [Symbol("foo")]: 2 };
obj = Object.assign({}, o1, o2);
console.log(obj); // { a : 1, [Symbol("foo")]: 2 }
Object.getOwnPropertySymbols(obj); // [Symbol(foo)]
```

其他示例查看官方 API

- 继承属性和不可枚举属性是不能拷贝的
- 异常会打断后续拷贝任务
- 拷贝访问器

其他知识点：属性描述符、可枚举属性、Object.defindProperty()、Object.getOwnPropertyDescriptor()

传送门

- [API：Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [API：Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [API：Object.defineProperties()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

## 联想

### 深浅拷贝问题

引用数据类型，它的实例是存储在堆中，在栈中只存储了指针地址，修改副本会影响到原数据

```js
var obj = { a: 1 };
var obj1 = obj;
obj1.a = 2;
console.log(obj1); // { a: 2 }
console.log(obj); // { a: 2 } 原数据也发生改变

// 解决方式
// 结构不复杂，只有一层数据结构
var obj = { a: 1 };
var obj1 = Object.assign({}, obj); // 或者 obj1 = { ...obj };
obj1.a = 2;
console.log(obj1); // { a: 2 }
console.log(obj); // { a: 1 }

// 结构复杂，有多层
var obj = { a: { id: 0, name: "a" } };
obj1 = JSON.parse(JSON.stringify(obj));
obj1.name = "aa";
console.log(obj1); // {a: { id: 0, name: 'aa'}}
console.log(obj); // {a: { id: 0, name: 'a'}}
```

`JSON.parse()` `JSON.stringify()`

- 函数 function、undefined 序列化后会被丢失
- 正则 RegExp、Error 对象序列化后变成空对象
- NaN、Infinity 和-Infinity，序列化的后变成 null
- Date 时间对象，序列化后转变成字符串

```js
var a = new Date(); // Sun May 03 2020 17:23:02 GMT+0800 (中国标准时间)
a.toString(); // "Sun May 03 2020 17:23:02 GMT+0800 (中国标准时间)"
JSON.parse(JSON.stringify(a)); // "2020-05-03T09:23:02.398Z"
```

- 只能序列化对象的可枚举的自有属性，例如 如果 obj 中的对象是有构造函数生成的， 则使用 JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的 constructor；
- 对象中存在循环引用的情况也无法正确实现深拷贝；

  综上所述，要完美实现深拷贝的话需要自己封装函数，`deepClone(data){// 抽时间练习一下}`

  参考资料：

  [关于 JSON.parse(JSON.stringify(obj))实现深拷贝应该注意的坑](https://www.jianshu.com/p/b084dfaad501)

### 闭包 & 垃圾回收机制

闭包-IE 内存泄漏问题：简单的说，闭包（子函数）让在（父）函数中的局部变量，无法释放，一直占用内存。过量后，会导致内存不足，从而在 IE 中造成内存泄漏问题，这个是 IE 自己的 bug，闭包表示这锅我不背。

传送门：

- [闭包-JavaScript|MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
- [我从来不理解 JavaScript 闭包，直到有人这样向我解释它...](https://zhuanlan.zhihu.com/p/56490498)(作者用 debuger 的方式，一个动作一个动作的解剖闭包执行过程)
- [js 闭包测试](https://www.cnblogs.com/rubylouvre/p/3345294.html)(测试了闭包对垃圾回收机制的影响，以及针对不同的 js 引擎，做了一些测试)
- [JavaScript 闭包的底层运行机制](http://blog.leapoahead.com/2015/09/15/js-closure/)
- [[译]发现 JavaScript 中闭包的强大威力](https://juejin.im/post/5c4e6a90e51d4552266576d2)
