function Mvvm(options = {}) {
  this.$options = options;
  let data = (this._data = this.$options.data);
  // 数据劫持
  observe(data);
  // 数据代理-简化取值 mvvm._data.content => mvvm.content
  for (let key in data) {
    Object.defineProperty(this, key, {
      get() {
        return this._data[key];
      },
      set(newVal) {
        if (this._data[key] === newVal) {
          return;
        }
        this._data[key] = newVal;
      },
    });
  }
}
