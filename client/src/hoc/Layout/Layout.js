import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Sidebar1 from "../../components/Sidebar/Sidebar";
import ContentSidebar from "../../components/Sidebar/ContentSidebar/ContentSidebar";
import AuthenCheck from "../../components/AuthenCheck/AuthenCheck";
import { userInfo } from "../../common/states/user-info";
import { authenCache } from "../../common/cache/authen-cache";

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleLogOut = async () => {
    await authenCache.clearAuthen();
    await userInfo.setState(null);
  };

  render() {
    return (
      <Fragment>
        <AuthenCheck>
          <Toolbar
            history={this.props.history}
            handleLogOut={this.handleLogOut}
          />
          <div id="container" className="space-navbar">
            <div className="sidebar-left">
              <Sidebar1 />
            </div>
            <div className="page">{this.props.children}</div>
            <div className="sidebar-right">
              <ContentSidebar />
            </div>
          </div>
        </AuthenCheck>
      </Fragment>
      // Add toolbar here
    );
  }
}

export default withRouter(Layout);
