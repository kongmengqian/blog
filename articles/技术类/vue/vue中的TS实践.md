# vue 中的 TS 实践

> 2019-12-10 09:48

# 依赖

## vue-class-component

> ECMAScript / TypeScript decorator for class-style Vue components.

[vue-class-component](https://github.com/vuejs/vue-class-component)是 vue 的官方库，作用是用类的方式编写组件。

```javascript
npm install --save vue-class-component
```

```javascript
<template>
  <div>
    <input v-model="msg">
    <p>prop: {{propMessage}}</p>
    <p>msg: {{msg}}</p>
    <p>helloMsg: {{helloMsg}}</p>
    <p>computed msg: {{computedMsg}}</p>
    <button @click="greet">Greet</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    propMessage: String
  }
})
export default class App extends Vue {
  // initial data
  msg = 123

  // use prop values for initial data
  helloMsg = 'Hello, ' + this.propMessage

  // lifecycle hook
  mounted () {
    this.greet()
  }

  // computed
  get computedMsg () {
    return 'computed ' + this.msg
  }

  // method
  greet () {
    alert('greeting: ' + this.msg)
  }
}
</script>
```

#### Mixins

before

```javascript
// mixin.js
import Vue from "vue";
import Component from "vue-class-component";

// You can declare a mixin as the same style as components.
@Component
export default class MyMixin extends Vue {
  mixinValue = "Hello";
}
```

using a mixin

```javascript
import Component, { mixins } from "vue-class-component";
import MyMixin from "./mixin.js";

// Use `mixins` helper function instead of `Vue`.
// `mixins` can receive any number of arguments.
@Component
export class MyComp extends mixins(MyMixin) {
  created() {
    console.log(this.mixinValue); // -> Hello
  }
}
```

#### 自定义装饰器（Create Custom Decorators）

```javascript
// decorators.js
import { createDecorator } from "vue-class-component";

export const NoCache = createDecorator((options, key) => {
  // component options should be passed to the callback
  // and update for the options object affect the component
  options.computed[key].cache = false;
});
```

```javascript
import { NoCache } from "./decorators";

@Component
class MyComp extends Vue {
  // the computed property will not be cached
  @NoCache
  get random() {
    return Math.random();
  }
}
```

#### 添加自定义的 Hooks

一般在 main.ts 文件中会添加下面这段代码（全局）

```javascript
// class-component-hooks.js
import Component from "vue-class-component";

// Register the router hooks with their names
Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate", // for vue-router 2.2+
]);
```

```javascript
// MyComp.js
import Vue from "vue";
import Component from "vue-class-component";

@Component
class MyComp extends Vue {
  // The class component now treats beforeRouteEnter
  // and beforeRouteLeave as Vue Router hooks
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter");
    next(); // needs to be called to confirm the navigation
  }

  beforeRouteLeave(to, from, next) {
    console.log("beforeRouteLeave");
    next(); // needs to be called to confirm the navigation
  }
}
```

#### undefinde 问题

直接用 undefinde 赋值给变量，不会生效，要用 null 才会生效，undefined 要生效的话，需要放在 data(){}里面 return 出去才可以。

```javascript
@Component
class MyComp extends Vue {
  // Will not be reactive
  foo = undefined;

  // Will be reactive
  bar = null;

  data() {
    return {
      // Will be reactive
      baz: undefined,
    };
  }
}
```

## vue-property-decorator

> This library fully depends on [vue-class-component](https://github.com/vuejs/vue-class-component), so please read its README before using this library.

```javascript
npm i -S vue-property-decorator
```

在 Vue 中使用 TS 时，[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)是非常好用的一个库，使用装饰器来简化书写。

- [`@Prop`](https://github.com/kaorun343/vue-property-decorator#Prop)
- [`@PropSync`](https://github.com/kaorun343/vue-property-decorator#PropSync)
- [`@Model`](https://github.com/kaorun343/vue-property-decorator#Model)
- [`@Watch`](https://github.com/kaorun343/vue-property-decorator#Watch)
- [`@Provide`](https://github.com/kaorun343/vue-property-decorator#Provide)
- [`@Inject`](https://github.com/kaorun343/vue-property-decorator#Provide)
- [`@ProvideReactive`](https://github.com/kaorun343/vue-property-decorator#ProvideReactive)
- [`@InjectReactive`](https://github.com/kaorun343/vue-property-decorator#ProvideReactive)
- [`@Emit`](https://github.com/kaorun343/vue-property-decorator#Emit)
- [`@Ref`](https://github.com/kaorun343/vue-property-decorator#Ref)
- `@Component` (provided by [vue-class-component](https://github.com/vuejs/vue-class-component))
- `Mixins` (the helper function named `mixins` provided by [vue-class-component](https://github.com/vuejs/vue-class-component))

#### @Prop(options:(PropOptions | Constructor[] | Constructor) = {}) 

接收一个参数，有三种写法：

1. Constructor，例如 String，Number，Boolean 等，指定 prop 的类型
1. Constructor[]，指定 prop 的可选类型
1. PropOptions，可以使用以下选项：type，default，required，validator

```javascript
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Prop(Number) readonly propA: number | undefined
  @Prop({ type: String, default: 'default value' }) readonly propB!: string
  @Prop([String, Boolean]) readonly propC: string | boolean | undefined
}

// 解释
// options可以是Constructor，也可以是由Constructor组成的数组，也可以是一个prop对象
// @Prop([String, Boolean]) readonly propC: string | boolean | undefined
//      构造器，首字母大写                  定义propC变量的数据类型，首字母小写 | 赋予默认值
// @Prop({ default: 'default value' }) readonly propB!: string
//      给予默认值                                     定义数据类型
// 总结：前面是Constructor那么后面要给一个默认值，一般是undefined。
//       如果有默认值，那么后面就直接定义一下变量的数据类型就可以了。
```

原来的写法

```javascript
export default {
  props: {
    propA: {
      type: Number,
    },
    propB: {
      type: String,
      default: "default value",
    },
    propC: {
      type: [String, Boolean],
    },
  },
};
```

注意：

- 属性的 ts 类型后面需要加上`undefined`类型；或者在属性名后面加上!，表示`非null` 和 `非undefined`
  的断言，否则编译器会给出错误提示；
- 指定默认值必须使用上面例子中的写法，如果直接在属性名后面赋值，会重写这个属性，并且会报错。

#### @PropSync(propName:string, options:(PropOptions | Constructor[] | Constructor) = {})

双向数据绑定，子组件的可以改变父组件的值，需要配合父组件的.sync 修饰符使用
[@PropSync 装饰器与@prop 区别](#)

1. 前者接收两个参数

propName:表示父组件传递过来的属性名；
options：与@prop 的第一个参数一致；

2. 前者会生成一个新的计算属性

示例

```javascript
import { Vue, Component, PropSync } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @PropSync('name', { type: String }) syncedName!: string
}
```

原来的写法

```javascript
export default {
  props: {
    name: {
      type: String,
    },
  },
  computed: {
    syncedName: {
      get() {
        return this.name;
      },
      set(value) {
        this.$emit("update:name", value);
      },
    },
  },
};
```

【**概念**】
**原始值**：具体的值，例如 3.14， "Hello"，true，null，undefind
**原始数据类型**：五种，分别是 number，string，boolean，null，undefind
**对象**：简单的说就是{firstName:"Bill", lastName:"Gates", age:62, eyeColor:"blue"}，名称：值 组成的变量
**构造函数**：JavaScript 提供用于原始对象的构造器

> 用大写首字母对构造器函数命名是个好习惯。

```javascript
var x1 = new Object(); // 一个新的 Object 对象
var x2 = new String(); // 一个新的 String 对象
var x3 = new Number(); // 一个新的 Number 对象
var x4 = new Boolean(); // 一个新的 Boolean 对象
var x5 = new Array(); // 一个新的 Array 对象
var x6 = new RegExp(); // 一个新的 RegExp 对象
var x7 = new Function(); // 一个新的 Function 对象
var x8 = new Date(); // 一个新的 Date 对象

// 推荐使用
var x1 = {}; // 新对象
var x2 = ""; // 新的原始字符串
var x3 = 0; // 新的原始数值
var x4 = false; // 新的原始逻辑值
var x5 = []; // 新的数组对象
var x6 = /()/; // 新的正则表达式对象
var x7 = function () {}; // 新的函数对象
```

#### @Model(event?:string, options:(PropOptions | Constructor[] | Constructor) = {})

该装饰器允许我们在一个组件上自定义 v-model，接收两个参数：

- event：事件名
- options：同@Prop 的第一个参数

```javascript
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Model('change', { type: Boolean }) readonly checked!: boolean
}
```

原来的写法

```javascript
export default {
  model: {
    prop: "checked",
    event: "change",
  },
  props: {
    checked: {
      type: Boolean,
    },
  },
};
```

上面的例子中指定的是“change”事件，所以还需要在 template 中加上相应的事件。

```javascript
<template>
  <input
    type="checkbox"
    :value="value"
    @change="$emit('change', $event.target.value)"
  />
</template>
```

#### @Watch(path: string, options: WatchOptions = {})

该装饰器接收两个参数

- path：被侦听的属性名
- options?:WatchOptions={} options 可以包含两个属性：
  - immediate?:boolean 侦听开始之后是否立即调用该回调函数；
  - deep?:boolean 被侦听的对象的属性被改变时，是否调用该回调函数；

_**侦听开始，发生在  beforeCreate  勾子之后，created  勾子之前**_

```javascript
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class YourComponent extends Vue {
  @Watch("child")
  onChildChanged(val: string, oldVal: string) {}

  @Watch("person", { immediate: true, deep: true })
  onPersonChanged1(val: Person, oldVal: Person) {}

  @Watch("person")
  onPersonChanged2(val: Person, oldVal: Person) {}
}
```

原来的写法

```javascript
export default {
  watch: {
    child: [
      {
        handler: "onChildChanged",
        immediate: false,
        deep: false,
      },
    ],
    person: [
      {
        handler: "onPersonChanged1",
        immediate: true,
        deep: true,
      },
      {
        handler: "onPersonChanged2",
        immediate: false,
        deep: false,
      },
    ],
  },
  methods: {
    onChildChanged(val, oldVal) {},
    onPersonChanged1(val, oldVal) {},
    onPersonChanged2(val, oldVal) {},
  },
};
```

#### @Emit(event?: string)

- `@Emit` 装饰器接收一个可选参数，该参数是`$Emit`的第一个参数，充当事件名。如果没有提供这个参数，`$Emit`会将回调函数名的`camelCase`转为`kebab-case`，并将其作为事件名；
- `@Emit`会将回调函数的返回值作为第二个参数，如果返回值是一个`Promise`对象，`$emit`会在`Promise`对象被标记为`resolved`之后触发；
- `@Emit`的回调函数的参数，会放在其返回值之后，一起被`$emit`当做参数使用。

```javascript
import { Vue, Component, Emit } from "vue-property-decorator";

@Component
export default class YourComponent extends Vue {
  count = 0;

  @Emit()
  addToCount(n: number) {
    this.count += n;
  }

  @Emit("reset")
  resetCount() {
    this.count = 0;
  }

  @Emit()
  returnValue() {
    return 10;
  }

  @Emit()
  onInputChange(e) {
    return e.target.value;
  }

  @Emit()
  promise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(20);
      }, 0);
    });
  }
}
```

原来的写法

```javascript
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    addToCount(n) {
      this.count += n;
      this.$emit("add-to-count", n);
    },
    resetCount() {
      this.count = 0;
      this.$emit("reset");
    },
    returnValue() {
      this.$emit("return-value", 10);
    },
    onInputChange(e) {
      this.$emit("on-input-change", e.target.value, e);
    },
    promise() {
      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(20);
        }, 0);
      });

      promise.then((value) => {
        this.$emit("promise", value);
      });
    },
  },
};
```

#### @Ref(refKey?: string)

该装饰器接收一个可选参数，用来指向元素或子组件的引用信息。如果没有提供这个参数，会使用装饰器后面的属性名充当参数

```javascript
import { Vue, Component, Ref } from 'vue-property-decorator'

import AnotherComponent from '@/path/to/another-component.vue'

@Component
export default class YourComponent extends Vue {
  @Ref() readonly anotherComponent!: AnotherComponent
  @Ref('aButton') readonly button!: HTMLButtonElement
}
```

原来的写法

```javascript
export default {
  computed() {
    anotherComponent: {
      cache: false,
      get() {
        return this.$refs.anotherComponent as AnotherComponent
      }
    },
    button: {
      cache: false,
      get() {
        return this.$refs.aButton as HTMLButtonElement
      }
    }
  }
}
```

## [vuex-class](https://github.com/ktsn/vuex-class/)

> Binding helpers for Vuex and vue-class-component

使用 Vuex 的时候，需要用到的一些装饰器

```javascript
npm install --save vuex-class
```

```javascript
import Vue from "vue";
import Component from "vue-class-component";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";

const someModule = namespace("path/to/module");

@Component
export class MyComp extends Vue {
  @State("foo") stateFoo;
  @State((state) => state.bar) stateBar;
  @Getter("foo") getterFoo;
  @Action("foo") actionFoo;
  @Mutation("foo") mutationFoo;
  @someModule.Getter("foo") moduleGetterFoo;

  // If the argument is omitted, use the property name
  // for each state/getter/action/mutation type
  @State foo;
  @Getter bar;
  @Action baz;
  @Mutation qux;

  created() {
    this.stateFoo; // -> store.state.foo
    this.stateBar; // -> store.state.bar
    this.getterFoo; // -> store.getters.foo
    this.actionFoo({ value: true }); // -> store.dispatch('foo', { value: true })
    this.mutationFoo({ value: true }); // -> store.commit('foo', { value: true })
    this.moduleGetterFoo; // -> store.getters['path/to/module/foo']
  }
}
```

看官方例子，我是啥也没看懂
下面是我自己在 kk 体育 h5 项目中的实践
这个是我引入 store 的页面

```javascript
// src/views/account/bankcard/Create.vue
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation, namespace } from 'vuex-class';

// 导入module，'account'就是导出来的store的名称
const accountModule = namespace('account');

@Component
export default class Create extends Vue {
  @accountModule.State((state) => state.formInfo) formInfo: any;// 就可以用store里面的formInfo变量了
  @accountModule.Mutation('SET_FORMINFO') setFormInfo: any;// 'SET_FORMINFO'是store里面的mutations的方法

	// ... 此处省略n行

	// 更改store里面的数据
  private handleChangeFormInfo(params: any) {
    this.setFormInfo({
      ...params
    });
  }
</script>

// 原来的写法
<script>
  import { mapState } from 'vuex';

  computed: {
    ...mapState({
      formInfo: state => state.account.formInfo,
    }),
  },

  handleChangeFormInfo(params) {
    this.$store.commit('account/SET_FORMINFO', {
      ...params,
    });
  },
</script>
```

如果要像官方示例中直接使用@State('string') target
里面的 string 是你 store 统一导出的 store 的名称，也就是我写的示例里面的'account'

```javascript
@State('account') stateAccount
@State(state => state.formInfo) formInfo: any;
```

这是我导出 store 的代码

```javascript
// src/store/index.ts
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context("./modules", false, /\.ts$/); // 引入modules目录下的文件

const modules = modulesFiles.keys().reduce((modules: any, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {}); // [moduleName] 就是./modules下的文件名

const store = new Vuex.Store({
  modules,
});

export default store;
```

这个是我的 store 的代码

```javascript
// import * as account from '@/api/account';
// src/store/modules/account.ts
const state: any = {
  formInfo: {
    cardNo: null,

    bankId: null,
    bankCode: null,
    bankTypeName: null,

    provinceId: null,
    provName: null,

    cityId: null,
    cityName: null,

    bankSubBranchId: null,
    bankSubBranchName: null,

    provNameAndCityName: null,

    checked: true,
  },

  subbranchInfo: {
    bankTypeCode: null,
    bankTypeName: null,
    provinceId: null,
    provName: null,
    cityId: null,
    cityName: null,
    bankSubBranchName: null,
    provNameAndCityName: null,
  },

  deposit: {
    gotoUrl: "user",
  },
};
const setFormInfoStorage: any = (formInfo: any) => {
  Object.keys(formInfo).forEach((item) => {
    localStorage.setItem(item, formInfo[item]);
  });
};

// 使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：
// 用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做
const mutations: any = {
  SET_FORMINFO: (state: any, form: any) => {
    setFormInfoStorage(form);
    state.formInfo = {
      ...state.formInfo,
      ...form,
    };
  },

  SET_SUBBRANCHINFO: (state: any, form: any) => {
    state.subbranchInfo = {
      ...state.subbranchInfo,
      ...form,
    };
  },
};

const actions: any = {
  getBankFormInfo(content: any, value: any) {
    content.commit("SET_FORMINFO", value);
  },

  getSubbranchInfo(content: any, value: any) {
    content.commit("SET_SUBBRANCHINFO", value);
  },
};

export default {
  namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称
  state,
  mutations,
  actions,
};
```

## [reflect-metadata](https://github.com/rbuckton/reflect-metadata)

用来初始默认值？？？没研究明白，好绕！好像是可以用来写入默认值

## [core-decorators](https://github.com/jayphelps/core-decorators)

第三方模块，提供了几个常见的装饰器
注意：core-decorators 和 typescript 不兼容。

# 参考资料

- [vue-property-decorator 使用指南](https://juejin.im/post/5c173a84f265da610e7ffe44)(有一些示例)
- [vue-property-decorator 使用手册](https://segmentfault.com/a/1190000019906321)(示例+用法解读)
- [ES6-装饰器](http://es6.ruanyifeng.com/#docs/decorator)（想要理解装饰器可以阅读这篇文章）
- [Vuex 文档](https://vuex.vuejs.org/zh/)（要在 ts 中使用状态管理的话，请先学习 vuex，再学习使用 vuex-class）
- [vue + typescript + vuex + vuex-class 如何使用！！！！！](https://blog.csdn.net/qq_33447462/article/details/85251527)（vuex-class 不知道怎么用可以看这篇文章）
