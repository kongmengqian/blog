# flex 弹性布局

## 容器

水平主轴、垂直交叉轴（次轴）

**作用在容器上的属性**

定义轴的方向：`flex-direction`

定义轴上的项目的对齐方式：`justify-content`

次轴上的项目对齐方式：`align-items`

一条轴线上放不下项目，那么定义换行的规则：`flex-wrap`

换行后，如何定义多条行（多根轴线）的对齐方式：`align-content`

组合的属性：`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。

**【实践】水平垂直居中**

1. 父元素设为`display:flex`,子元素在主次轴方向都居中显示即可

```html
<style>
  .box {
    display: flex;
    width: 400px;
    height: 400px;
    justify-content: center;
    align-items: center;
  }
  .item1 {
    width: 100px;
    height: 100px;
  }
</style>

<div class="box">
  <div class="item1"></div>
</div>
```

2. 父元素设为`display:flex`,子元素利用`margin:auto`实现上下左右居中

```html
<style>
  .box {
    display: flex;
    width: 400px;
    height: 400px;
  }
  .item1 {
    width: 100px;
    height: 100px;
    margin: auto;
  }
</style>

<div class="box">
  <div class="item1"></div>
</div>
```

## 项目

`order`属性定义项目的排列顺序。数值越小，排列越靠前，默认为`0`。

`align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

`flex-grow`属性定义项目的放大比例，默认为**0**，即如果存在剩余空间，也不放大。
`flex-shrink`属性定义了项目的缩小比例，默认为**1**，即如果空间不足，该项目将缩小。
`flex-basis`属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为**auto**，即项目的本来大小。

### flex

默认的 `flex：0 1 auto` 小屏幕会自适应，会自动缩小，大屏幕不会自适应 **联想记忆：不（不放大 0）、是（会缩小 1）、我（保持原有大小）**

`flex: auto (1 1 auto)` 大小屏幕都自适应，小屏幕会自动缩小；大屏幕会自动放大。

`flex: none (0 0 auto)` 不自适应，始终保持原样

`flex: 1 (1 1 0%)` 大小屏幕都自适应，小屏幕会自动缩小；大屏幕会自动放大。**让所有弹性盒模型对象的子元素都有相同的长度，且忽略它们内部的内容**
