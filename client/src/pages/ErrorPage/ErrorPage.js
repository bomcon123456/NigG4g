import React, { Component } from "react";
import { Link } from "react-router-dom";
class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="error-page">
        <div className="background-404" />
        <header className="top-nav">
          <Link className="logo-9gag" to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64px"
              height="48px"
              viewBox="0 0 64 48"
              version="1.1"
            >
              <title>logo</title>
              <desc>Created with Sketch.</desc>
              <g
                id="Asset"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g id="logo" fill="#FFFFFF">
                  <path
                    d="M32 12L21 18.25 21 20.75 32 27 38.6 23.25 38.6 28.25 32 32 25.4 28.25 21 30.75 32 37 43 30.75 43 18.25 32 12ZM27.6 19.5L32 17 36.4 19.5 32 22 27.6 19.5 27.6 19.5Z"
                    id="Icon"
                  />
                </g>
              </g>
            </svg>
          </Link>
        </header>
        <div className="message-404">
          <h1>404</h1>
          <h2>There's nothing here.</h2>
          <h3>Find what you're looking for with our app.</h3>
          <button className="btn-download-app">Download app</button>
        </div>
      </div>
    );
  }
}
export default ErrorPage;
