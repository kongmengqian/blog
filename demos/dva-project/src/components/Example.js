import React from "react";

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.currentItemData.id !== nextProps.currentItemData.id) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    console.log("this is componentDidMount");
  }

  componentDidUpdate() {
    console.log("this is componentDidUpdate");
  }

  componentWillUnmount() {
    console.log("this is componentWillUnmount");
  }

  render() {
    console.log(this.props.currentItemData);
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
      </>
    );
  }
}

Example.propTypes = {};

export default Example;
