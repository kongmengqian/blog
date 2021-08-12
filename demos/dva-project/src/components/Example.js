import React from "react";
import D1 from "./D1";

class Example extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.ref = React.createRef();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.currentItemData.id !== nextProps.currentItemData.id) {
  //     return true;
  //   }
  //   return false;
  // }

  componentDidMount() {
    console.log("this is componentDidMount");
    console.log(this.ref.current); // input DOM
  }

  componentDidUpdate(prevProps) {
    console.log("this is componentDidUpdate");
    if (this.props.currentItemData.id !== prevProps.currentItemData.id) {
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    console.log("this is componentWillUnmount");
  }

  render() {
    console.log(this.props.currentItemData);
    const childrenArr = React.Children.toArray(this.props.children);
    console.log(childrenArr, this.props.children);
    React.Children.map(this.props.children, function (c, i) {
      console.log(c, i);
    });
    React.Children.map(
      (() => {
        return "this.props.children是函数";
      })(),
      function (c, i) {
        console.log(c, i);
      }
    );

    return (
      <>
        <div>
          currentItem Id：
          {this.props.currentItemData.id === undefined
            ? "-"
            : this.props.currentItemData.id}
        </div>
        <div>
          currentItem deepProps：
          {this.props.currentItemData.deepProps &&
            this.props.currentItemData.deepProps.map((item) => {
              return item;
            })}
        </div>
        <input ref={this.ref} />
        <D1 currentItemData={this.props.currentItemData} />
      </>
    );
  }
}

Example.propTypes = {};

export default Example;
