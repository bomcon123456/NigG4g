import React, { Component } from "react";
import { appModal, ModalsRegistry } from "./common/react/modals/modals";
import Toolbar from ".././src/components/Navigation/Toolbar/Toolbar";
import { loginModal } from "./common/react/modals/login/login";
import { userInfo } from "./common/states/user-info";
import classnames from "classnames";

import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  componentDidMount() {
    // loginModal.open(this.handleLogin);
    // appModal
    //   .alert({
    //     text: "This is a freaking modal bitch",
    //     title: "Modal Show up!"
    //   })
    //   .then(() => {
    //     console.log("hehehe");
    //   });
  }

  handleLogin = () => {
    this.forceUpdate();
  };

  render() {
    const info = userInfo.getState();
    let loginCSS = info ? "App-login" : null;
    return (
      <div className="App">
        <ModalsRegistry />
        <Toolbar />
      </div>
    );
  }
}

export default App;
