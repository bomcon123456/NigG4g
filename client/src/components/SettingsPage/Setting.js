import React, { Component } from "react";


class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props)
    return (
      <div>
        {this.props.match.params.settingId}
      </div>
    );
  }
}

export default Setting;
