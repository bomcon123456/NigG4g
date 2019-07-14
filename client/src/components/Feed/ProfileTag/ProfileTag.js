import React, { Component } from "react";
import classnames from "classnames";

class profileTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTag: "Hot"
    };
  }

  render() {
    let { currentTag } = this.state;
    return (
      <div className="profile">
        <section className="profile-header">
          <header>
            <h1>{this.props.title}</h1>
          </header>
        </section>
        <div className="tab-bar">
          <ul className="menu">
            <li
              onClick={() => {
                this.setState({ currentTag: "Hot" });
                // this.props.handleClick("Hot");
              }}
            >
              <div
                className={classnames({
                  selected: currentTag === "Hot"
                })}
              >
                Hot
              </div>
            </li>
            <li
              onClick={() => {
                this.setState({
                  currentTag: "Fresh"
                });
                // this.props.handleClick("Fresh");
              }}
            >
              <div
                className={classnames({
                  selected: currentTag === "Fresh"
                })}
              >
                Fresh
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default profileTag;
