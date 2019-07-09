import React, { Component } from "react";
import classnames from "classnames";

// import { appModal } from "../../common/react/modals/modals";
// import { loginModal } from "../../common/react/modals/login/login";
// import { registerModal } from "../../common/react/modals/register/register";
// import { uploadPostModal } from "../../common/react/modals/upload-post/upload-post";
// import { uploadFromUrlModal } from "../../common/react/modals/upload-post/upload-from-url/upload-from-url";
import Layout from "../../hoc/Layout/Layout";
import { userInfo } from "../../common/states/user-info";

import logo from "../../logo.svg";

class App extends Component {
  componentDidMount() {
    // loginModal.open(this.handleLogin);
    // uploadPostModal.open(this.handleLogin);
    // uploadFromUrlModal.open(this.handleLogin);
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
      <Layout>
        <div className="App">
          <main className={classnames("App-header", loginCSS)}>
            <img src={logo} className="App-logo" alt="logo" />
            {info ? (
              `Welcome back, ${info.username}`
            ) : (
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
            )}
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </main>
        </div>
      </Layout>
    );
  }
}
export default App;
