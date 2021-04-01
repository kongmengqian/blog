import React from "react";
import { Router, Route, Switch } from "dva/router";
import IndexPage from "./routes/IndexPage";
import DemoPage from "./page/demo";

function RouterConfig(options) {
  /**
   * app: any
   * history: IHistory
   */
  console.log("router", options);
  /**
   * action:string
   * go:(n:number) => void
   * goBack:() => void
   * goForward:() => void
   * listen:(callback) => void
   * location:{}
   * push:(path, state) => void
   * replace:(path, state) => void
   */
  const { history } = options;
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/demo" exact component={DemoPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
