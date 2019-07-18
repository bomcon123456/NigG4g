import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import { ModalsRegistry } from "./common/react/modals/modals";

import MainPage from "./pages/MainPage/MainPage";
import TestPage from "./pages/TestPage/TestPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword/ConfirmResetPassword";
import Toolbar from "./components/Navigation/Toolbar/Toolbar";
import VerifyAccount from "./pages/VerifyAccount/VerifyAccount";

import Feed from "./components/Feed/Feed";
import FullPostPage from "./pages/FullPostPage/FullPostPage";

class App extends Component {
  render() {
    return (
      <div>
        <ModalsRegistry />
        <Switch>
          <Route path="/gag/:postId" component={FullPostPage} />
          <Route path="/test-nav-bar" component={Toolbar} />
          <Route path="/test-feed" component={Feed} />
          <Route path="/verify-user" component={VerifyAccount} />
          <Route
            path="/confirm-reset-password"
            component={ConfirmResetPassword}
          />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/test" exact component={TestPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/" exact component={MainPage} />
          <Route component={ErrorPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
