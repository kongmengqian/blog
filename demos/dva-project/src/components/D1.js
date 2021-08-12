import React from "react";

class D1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.currentItemData.id !== nextProps.currentItemData.id) {
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    console.log(" D1 render");
    return (
      <div>
        {`这是子组件D1，currentItemData.id=${this.props.currentItemData.id}`}
      </div>
    );
  }
}

D1.propTypes = {};

export default D1;
