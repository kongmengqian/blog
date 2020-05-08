function Observe(data) {
  // 循环遍历，给每个数据添加get set方法，数据劫持
  for (let key in data) {
    let val = data[key];
    // 递归，劫持子数据
    observe(val);
    Object.defineProperty(data, key, {
      configurable: true,
      get() {
        return val;
      },
      set(newVal) {
        // 没有变化就不做后续操作
        if (newVal === val) {
          return;
        }
        val = newVal;
        // 需要给新的值绑定get set
        // eg:newVal = [{id: 0, name: 'item1'},{id: 1, name: 'item2'}]
        observe(newVal);
      },
    });
  }
}

function observe(data) {
  // 数据为 undefined || null || 0 || false || 原始数据类型: string|number|boolean 的时候不需要创建 Observe
  // 简单的说，[] | {} 有子集的时候，继续递归
  // console.log(data);
  if (!data || typeof data !== "object") return;
  // console.log(data);
  return new Observe(data);
}
