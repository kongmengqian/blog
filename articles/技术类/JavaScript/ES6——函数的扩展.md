# ES6——函数的扩展

1. 函数的参数可以指定默认值

```js
function (a = 0, b = 0) {
  return a + b;
}
```

**需要注意的点：**

- 函数的 length 属性：指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真。

```js
(function (a) {}.length); // 1
(function (a = 5) {}.length); // 0
(function (a, b, c = 5) {}.length); // 2
```

- 作用域问题：如果参数指定的默认值是变量的话，就需要特别注意
  > 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。

```js
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2); // 2
```

上面代码中，参数`y`的默认值等于变量`x`。调用函数`f`时，参数形成一个单独的作用域。在这个作用域里面，默认值变量`x`指向第一个参数`x`，而不是全局变量`x`，所以输出是`2`。

2. rest 参数（形式为`...变量名`）：用于获取函数的多余参数，这样就不需要使用`arguments`**对象**了。`rest`参数搭配的变量是一个**数组**，该变量将多余的参数放入数组中。

```js
//ES5 arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// ES6 类数组=>数组，可以使用Array.from() 与上面等同
function sortNumbers() {
  return Array.from(arguments).sort();
}

// ES6 rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```

**需要注意的点：**

- 函数的`length`属性，不包括 `rest` 参数。

```js
(function (a) {}.length); // 1
(function (...a) {}.length); // 0
(function (a, ...b) {}.length); // 1
```

3. 函数的`name`属性，返回该函数的函数名。

   > 这个属性早就被浏览器广泛支持，但是直到 ES6，才将其写入了标准。

**要注意的点：**

- ES6 对这个属性的行为做出了一些修改。如果将一个匿名函数赋值给一个变量，`ES`5 的 `name` 属性，会返回空字符串，而 `ES6` 的 `name` 属性会返回实际的函数名。

```js
var f = function () {};

// ES5
f.name; // ""

// ES6
f.name; // "f"
```

- 如果将一个具名函数赋值给一个变量，则 `ES5` 和 `ES6` 的`name`属性都返回这个具名函数原本的名字。

```js
const bar = function baz() {};

// ES5
bar.name; // "baz"

// ES6
bar.name; // "baz"
```

4. 箭头函数

详见[箭头函数笔记](./箭头函数.md)

5. 尾调用优化：什么是尾调用？指某个函数的最后一步是调用另一个函数。什么是尾调用优化？只保留内层函数的调用帧，从而大大节省内存空间。
   > 有**调用栈**，**调用帧（调用记录）**概念——个人理解：其实就是 js 执行的一个执行过程，然后有闭包的概念，特点，缺点，尾调用优化其实可以解决闭包无法释放内存的缺点，大大节省内存空间。不过也要视情况而定，如果内层函数用到了外层函数的内部变量，那么是无法进行尾调用优化的，还是有挺大的局限性的。
6. 尾递归：函数调用自身，称为递归。如果尾调用自身，就称为尾递归。可以避免发生“栈溢出”错误。
   > 涉及到算法的优化，相对节省内存。函数式编程的一些思想：柯里化（定义：将多参数的函数转换成单参数的形式）。尾递归优化只在严格模式下生效。那么在正常模式下进行要实现尾递归优化，就只能自己实现尾递归优化了，可以采用“循环”换掉“递归”的方式。

```js
function sum(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

sum(1, 100000);
// Uncaught RangeError: Maximum call stack size exceeded(…)
```

上面代码中，`sum`是一个递归函数，参数`x`是需要累加的值，参数`y`控制递归次数。一旦指定`sum`递归 `100000` 次，就会报错，提示超出调用栈的最大次数。

蹦床函数（trampoline）可以将递归执行转为循环执行。

```js
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
```

上面就是蹦床函数的一个实现，它接受一个函数 f 作为参数。只要 f 执行后返回一个函数，就继续执行。注意，这里是返回一个函数，然后执行该函数，而不是函数里面调用函数，这样就避免了递归执行，从而就消除了调用栈过大的问题。

然后，要做的就是将原来的递归函数，改写为每一步返回另一个函数。

```js
function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}
```

上面代码中，sum 函数的每次执行，都会返回自身的另一个版本。

现在，使用蹦床函数执行 sum，就不会发生调用栈溢出。

```js
trampoline(sum(1, 100000));
// 100001
```

蹦床函数并不是真正的尾递归优化，下面的实现才是。

```js
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];

  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}

var sum = tco(function (x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
});

sum(1, 100000);
// 100001
```

上面代码中，`tco`函数是尾递归优化的实现，它的奥妙就在于状态变量`active`。默认情况下，这个变量是不激活的。一旦进入尾递归优化的过程，这个变量就激活了。然后，每一轮递归 sum 返回的都是`undefined`，所以就避免了递归执行；而`accumulated`数组存放每一轮`sum`执行的参数，总是有值的，这就保证了`accumulator`函数内部的`while`循环总是会执行。这样就很巧妙地将“递归”改成了“循环”，而后一轮的参数会取代前一轮的参数，保证了调用栈只有一层。

——尾递归内容都摘抄于[阮一峰的 ES6 函数的扩展章节-尾递归模块](https://es6.ruanyifeng.com/#docs/function)

> 以后编程的时候会注意这个点，不过要自己消化掉，然后自己能写出来，还需要多看多写，这个好难

## 参考资料

> 只记录了最基础的点，更多的请学习阮一峰的 ES6 函数的扩展章节

- [阮一峰的 ES6 函数的扩展章节](https://es6.ruanyifeng.com/#docs/function)
