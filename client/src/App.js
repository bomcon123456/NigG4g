import React, { Component } from "react";
import { appModal, ModalsRegistry } from "./common/react/modals/modals";
import { loginModal } from "./common/react/modals/login/login";

import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  componentDidMount() {
    loginModal.open(this.handleLogin);
    // appModal
    //   .alert({
    //     text: "This is a freaking modal bitch",
    //     title: "Modal Show up!"
    //   })
    //   .then(() => {
    //     console.log("hehehe");
    //   });
  }

  render() {
    return (
      <div className="App">
        <ModalsRegistry />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
