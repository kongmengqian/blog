export default {
  namespace: "example",

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      console.log("subscriptions setup", history);
      history.listen((location) => {
        if (location.pathname === "/") {
          dispatch({
            type: "save",
            payload: { test: "初始化" },
          });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: "save" });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    add(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
