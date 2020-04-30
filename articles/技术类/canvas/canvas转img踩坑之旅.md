# canvas 转 img 踩坑之旅

> 2019-04-26 20:52

1. 绘制 canvas

- 自行查阅 canvas API 进行绘制

2. 绘制的图片像素太低——解决方案：获取设备像素比，放大 canvas 的宽高，将所有绘制内容放大像素比倍

```javascript
// 获取想要转换的 DOM 节点
const dom = document.querySelector("#share");

const box = window.getComputedStyle(dom);

// DOM 节点计算后宽高
const width = Math.ceil(parseFloat(box.width));
const height = Math.ceil(parseFloat(box.height));

// 获取像素比
const scaleBy = this.DPR();

// 创建自定义 canvas 元素
let canvas = document.getElementById("canvas");

// 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
canvas.width = width * scaleBy;
canvas.height = height * scaleBy;

// 设定 canvas css宽高为 DOM 节点宽高
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

// 获取画笔
let context = canvas.getContext("2d");
// 清空画布
context.clearRect(0, 0, canvas.width, canvas.height);

// 将所有绘制内容放大像素比倍
context.scale(scaleBy, scaleBy);
```

2. ios——img.onload()失效

- 解决办法：new XMLHttpRequest() --> xhr.onload --> window.URL.createObjectURL(xhr.response)

```javascript
/**
     * @example <caption>创建图片(解决ios/安卓低版本下img.onload()失效)</caption>
     * this.createImg(ctx, imgUrl, position).then();
     *
     * @param {string} ctx - 画笔
     * @param {string} imgUrl - 图片地址
     * @param {object} position - 图片在canvas上的坐标
     *
     * @returns
     */
    createImg(ctx, imgUrl, position) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        const imageUrl = imgUrl;
        // 支持跨域
        image.setAttribute('crossOrigin', 'Anonymous');

        // const domain = imgUrl.split('/');
        // if (domain[2] && !imgUrl.includes('data:image')) {
        //   image.setAttribute('origin', `${domain[0]}//${domain[2]}`);
        // }

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob'; // 二进制
        xhr.withCredentials = true;
        xhr.onload = req => {
          const resToUrl = window.URL.createObjectURL(xhr.response);
          image.src = resToUrl;
          const time = setInterval(() => {
            if (image.complete) {
              clearInterval(time);
              const { x, y, w, h, t = true } = position;
              // 是否需要转换 适配
              if (t) {
                ctx.drawImage(
                  image,
                  this.getScaleNumber(x),
                  this.getScaleNumber(y),
                  this.getScaleNumber(w),
                  this.getScaleNumber(h),
                );
              } else {
                ctx.drawImage(image, x, y, w, h);
              }

              resolve();
            }
          }, 200);
        };
        xhr.open('GET', imgUrl, true);
        xhr.send();
      });
    },
```

3. 图片有跨域 canvas.toDataURL('image/png')报错

- 让后端在 nginx 上配置允许跨域  **Access-Control-Allow-Origin:\***

4. base64 图片再次报跨域问题

```javascript
/*
把其他域的图片在canvas中转换为base64时，会遇到跨域安全限制。
目前，唯一可行的方案是，把图片文件以arraybuffer的形式ajax下载下来，然后直接转base4。
但是，这样有个毛病，就是可能会浪费带宽，多下载一次。
*/
/**
     * @example <caption>解决base64图片跨域</caption>
     * this.getBase64ByUrl(ctx, imgUrl, position, outputFormat).then();
     *
     * @param {string} ctx - 画笔
     * @param {string} imgUrl - 图片地址
     * @param {object} position - 图片在canvas上的坐标
     * @param {string} outputFormat - 输出类型
     *
     * @returns
     */
    getBase64ByUrl(ctx, imgUrl, position, outputFormat = 'image/png') {
      return new Promise((resolve, reject) => {
        const image = new Image();
        const imageUrl = imgUrl;
        image.setAttribute('crossOrigin', 'Anonymous');
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onload = e => {
          if (xhr.status == 200) {
            var uInt8Array = new Uint8Array(xhr.response);
            var i = uInt8Array.length;
            var binaryString = new Array(i);
            while (i--) {
              binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = binaryString.join('');
            var base64 = window.btoa(data);
            var dataUrl = `data:${outputFormat};base64,${base64}`;
            image.src = dataUrl;

            const time = setInterval(() => {
              if (image.complete) {
                clearInterval(time);
                const { x, y, w, h, t = true } = position;

                ctx.drawImage(
                  image,
                  this.getScaleNumber(x),
                  this.getScaleNumber(y),
                  this.getScaleNumber(w),
                  this.getScaleNumber(h),
                );
                resolve();
              }
            }, 200);
          }
        };
        xhr.open('GET', imgUrl, true);
        xhr.send();
      });
    },
```
