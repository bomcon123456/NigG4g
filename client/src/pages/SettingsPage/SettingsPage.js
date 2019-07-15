import React, { Component } from "react";
import Setting from "../../components/SettingsPage/Setting";
import Account from "../../components/SettingsPage/Account";

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
          <Switch>
            <Route path={`${this.props.match.path}/:settingId`} component={Setting} />
            <Route path={`${this.props.match.path}`} component={Account} />
          </Switch>
        </div>
      </LayoutWithoutSidebarRight>
    );
  }
}

export default SettingsPage;
