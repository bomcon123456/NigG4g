import React, { Component } from "react";
import Setting from "../../components/SettingsPage/Setting";
import LayoutWithoutSidebarRight from "../../hoc/Layout/LayoutWithoutSidebarRight"

import { Route, Link, Switch } from "react-router-dom";

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    return (
      <LayoutWithoutSidebarRight>
        <div id="settings">
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
          <Route path={`${this.props.match.path}/"topicId`} component={Setting} />

        </div>
      </LayoutWithoutSidebarRight>
    );
  }
}

export default SettingsPage;
