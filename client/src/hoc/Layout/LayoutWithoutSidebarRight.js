import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Sidebar1 from "../../components/Sidebar/Sidebar";
// import ContentSidebar from "../../components/Sidebar/ContentSidebar/ContentSidebar"

class LayoutWithoutSidebarRight extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleLoginSuccess = () => {
    this.forceUpdate();
  };

  render() {
    return (
      <Fragment>
        <Toolbar
          handleLoginSuccess={this.handleLoginSuccess}
          history={this.props.history}
        />
        <div id="container" className="space-navbar">
          <div className="sidebar-left">
            <Sidebar1 />
          </div>
          <div className="page-container">{this.props.children}</div>
        </div>
      </Fragment>
      // Add toolbar here
    );
  }
}

export default withRouter(LayoutWithoutSidebarRight);
