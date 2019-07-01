import React, { Component } from "react";
import { userApi } from "./common/api/common/user-api";
import { authApi } from "./common/api/common/auth-api";
import { axiosApi } from "./common/api/api";
import { authenCache } from "./common/cache/authen-cache";
import { userInfo } from "./common/states/user-info";

import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  componentDidMount() {
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
