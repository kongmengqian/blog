import React, { useEffect } from "react";
import { connect } from "dva";
import Example from "../components/Example";
import styles from "./IndexPage.css";
import { Link } from "dva/router";
// import { delayed } from "../utils";

function IndexPage(props) {
  console.log("props", props);

  // 一开始 props.loading.effects = {}  isLoading = undefined
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
      {/* 添加 isLoading === undefined 的判断 */}
      {isLoading || isLoading === undefined ? (
        "加载中..."
      ) : (
        <div className={styles.normal}>
          <h1 className={styles.title}>Yay! Welcome to dva!</h1>
          <div className={styles.welcome} />

          <ul>
            <li>
              <Link to="/demo">npm包——kongmq-demo 页面</Link>
            </li>
          </ul>

          <ul className={styles.list}>
            {props.example.list &&
              props.example.list.map((item, index) => {
                return (
                  <li
                    key={item.id}
                    onClick={() => {
                      const deepProps = item.deepProps;
                      deepProps.push(item.content);
                      console.log(item, "==================");
                      // 每次指向一个新的指针地址
                      // const currentItem = {...item, deepProps};
                      // 指向的是同一个指针地址，deepProps的变化，<Example>组件用React.PureComponent的时候察觉不到状态的变化，从而出现bug
                      const currentItem = item;
                      const list = props.example.list;
                      list[index] = currentItem;

                      props.dispatch({
                        type: "example/save",
                        payload: {
                          test: "用户点击行为-显示Example组件",
                          currentItem,
                          list,
                        },
                      });
                    }}
                  >
                    {item.content}
                  </li>
                );
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
          <div>
            <h4>Example 组件 </h4>
            <Example currentItemData={props.example.currentItem}>
              <div>
                <div>1</div>
                <div>2</div>
              </div>
              <div>3</div>
            </Example>
          </div>
          <button
            onClick={() => {
              const list = props.example.list;
              const l = list.length;

              list.push({
                id: l,
                content: `item${l}`,
                deepProps: [],
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
                  currentItem: {},
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
