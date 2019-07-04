import React, { Component } from "react";
import { appModal, ModalsRegistry } from "./common/react/modals/modals";
import { loginModal } from "./common/react/modals/Login/login";

import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  componentDidMount() {
    // loginModal.open();
    appModal
      .alert({
        text: "This is a freaking modal bitch",
        title: "Modal Show up!"
      })
      .then(() => {
        console.log("hehehe");
      });
    // authApi
    //   .post({
    //     email: "axios@admin.com",
    //     password: "password"
    //   })
    //   .then(data => {
    //     authenCache.setAuthen(data.data.token, { expire: 1 });
    //     userApi
    //       .put(userInfo.getState()["_id"], {
    //         gender: true
    //       })
    //       .then(data => {
    //         console.log(data);
    //       })
    //       .catch(err => {
    //         // ERROR HANDLING
    //       });
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
