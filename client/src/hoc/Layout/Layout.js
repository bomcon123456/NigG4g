import React, { Component } from "react";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      // Add toolbar here
      <div className="container">
        <Toolbar />
        <div className="row justify-content-center">
          {/* Add sidebar-1 here */}
          <div className="col-sm">{this.props.children}</div>
          {/* Add sidebar-2 here */}
        </div>
      </div>
    );
  }
}

export default Layout;
