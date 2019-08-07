import React, { Component } from "react";
import Setting from "../../components/SettingsPage/Setting";
import Account from "../../components/SettingsPage/Account";

import LayoutWithoutSidebarRight from "../../hoc/Layout/LayoutWithoutSidebarRight";

import { Route, Link, Switch } from "react-router-dom";

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'account'
    };
  }


  render() {
    console.log(this.props);
    return (
      <LayoutWithoutSidebarRight>
        <div id="settings">
          <ul className="form-nav">
            <li key="Account" onClick={() => { this.setState({ name: 'account' }) }}>
              <Link className={this.state.name === 'account' ? 'selected' : ''} to={`${this.props.match.url}/account`}>Account</Link>
            </li>
            <li key="Password" onClick={() => { this.setState({ name: 'password' }) }}>
              <Link className={this.state.name === 'password' ? 'selected' : ''} to={`${this.props.match.url}/password`}>Password</Link>
            </li>
            <li key="Profile" onClick={() => { this.setState({ name: 'profile' }) }}>
              <Link className={this.state.name === 'profile' ? 'selected' : ''} to={`${this.props.match.url}/profile`}>Profile</Link>
            </li>
          </ul>
          <Switch>
            <Route
              path={`${this.props.match.path}/:settingId`}
              component={Setting}
            />
            <Route path={`${this.props.match.path}`} component={Account} />
          </Switch>
        </div>
      </LayoutWithoutSidebarRight>
    );
  }
}

export default SettingsPage;
