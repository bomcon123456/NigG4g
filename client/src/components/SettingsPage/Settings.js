import React, { Component } from "react";
import LayoutWithoutSidebarRight from "../../hoc/Layout/LayoutWithoutSidebarRight"
import { Route, Link, Switch } from "react-router-dom";
import Setting from "./Setting"

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props)
    return (
      <ul className="form-nav">
        <li key="Account">
          <Link to={`${this.props.match.url}/account`}>Account</Link>
        </li>
        <li key="Password">
          <Link to={`${this.props.match.url}/password`}>Password</Link>
        </li>
        <li key="Profile">
          <Link to={`${this.props.match.url}/profile`}>Profile</Link>
        </li>
      </ul>
    );
  }
}

export default Settings;
