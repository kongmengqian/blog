import { delayed } from "../utils";

export default {
  namespace: "example",

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      console.log("subscriptions setup", history);
      // history.listen((location) => {
      //   if (location.pathname === "/") {
      //     dispatch({
      //       type: "save",
      //       payload: {
      //         test: "监听路由",
      //       },
      //     });
      //   }
      // });
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      // 用来访问model
      yield select((options) => {
        console.log("effects-select", options);
      });
      // eslint-disable-line
      yield call(delayed);
      yield put({
        type: "save",
        payload: {
          list: [
            {
              id: 0,
              content: "异步item0",
              deepProps: [],
            },
            {
              id: 1,
              content: "异步item1",
              deepProps: [],
            },
          ],
          ...payload,
        },
      });
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
