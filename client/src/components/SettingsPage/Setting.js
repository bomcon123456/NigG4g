import React, { Component } from "react";
import Account from "./Account";
import Profile from "./Profile";
import Password from "./Password";

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    return (
      <div>
        {this.props.match.params.settingId === "account" && <Account />}
        {this.props.match.params.settingId === "password" && <Password />}
        {this.props.match.params.settingId === "profile" && <Profile />}
      </div>
    );
  }
}

export default Setting;
