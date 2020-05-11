import dva from "dva";
import exampleModal from "./models/example";
import exampleRouter from "./router";
import "./index.css";

// 1. Initialize
const app = dva({
  initialState: {
    example: {
      list: [
        { id: 0, content: "item0" },
        { id: 1, content: "item1" },
      ],
      test: "test",
    },
  },
});
console.log(app);
setTimeout(() => {
  const store = app._store;
  /**
   * dispatch:(action: {type: string, [key: string]?: any}) => viod
   * getState:() => return {routing: {location:any}, @@dva:number, [key:string]:any} 最后一个值就是initialState里面的状态
   */
  console.log(store);
  console.log(store.getState());
}, 0);

// 2. Plugins
// app.use({});

// 3. Model
app.model(exampleModal);

// 4. Router
app.router(exampleRouter);

// 5. Start
app.start("#root");
