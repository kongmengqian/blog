import React, { useEffect } from "react";
import { connect } from "dva";
import styles from "./IndexPage.css";

function IndexPage(props) {
  console.log("props", props);
  const isLoading = props.loading.effects["example/fetch"];
  useEffect(() => {
    props.dispatch({
      type: "example/fetch",
      payload: {
        test: "页面初始化-异步请求数据",
      },
    });
  }, []);
  return (
    <div>
      {isLoading && "加载中..."}
      {!isLoading && (
        <div className={styles.normal}>
          <h1 className={styles.title}>Yay! Welcome to dva!</h1>
          <div className={styles.welcome} />
          <ul className={styles.list}>
            {props.example.list &&
              props.example.list.map((item) => {
                return <li key={item.id}>{item.content}</li>;
              })}
            <li>{props.example.test}</li>
            {/* <li>
          To get started, edit <code>src/index.js</code> and save to reload.
        </li>
        <li>
          <a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">
            Getting Started
          </a>
        </li> */}
          </ul>
          <button
            onClick={() => {
              const list = props.example.list;
              const l = list.length;

              list.push({
                id: l,
                content: `item${l}`,
              });
              props.dispatch({
                type: "example/add",
                payload: {
                  list,
                  test: "add list",
                },
              });
            }}
          >
            添加
          </button>
          <button
            onClick={() => {
              props.dispatch({
                type: "example/fetch",
                payload: {
                  test: "用户点击行为-异步请求数据",
                },
              });
            }}
          >
            请求数据
          </button>
        </div>
      )}
    </div>
  );
}

IndexPage.propTypes = {};
// 简写
export default connect(({ example, loading }) => ({ example, loading }))(
  IndexPage
);

/**
 * 展开的写法
 * connect((state: any) => {return state}) 这个函数接收一个function，function会把state传出来
 * connect()(fun: () => {rueurn <ReactNode />})
 */
// export default connect(({ example }) => {
//   // 会塞到props里面
//   const { list = [] } = example;
//   return {
//     list,
//     test: [],
//   };
// })((props) => {
//   /**
//    * props:{
//    *  dispatch:(action) => void
//    *  history:{},
//    *  state: 上面return的{list, test}
//    *  location:{}
//    *  match:{}
//    * }
//    */
//   console.log("展开写法", props);
//   return (
//     <ul>
//       {props.list &&
//         props.list.map((item) => {
//           return <li key={item.id}>{item.content}</li>;
//         })}
//     </ul>
//   );
// });
