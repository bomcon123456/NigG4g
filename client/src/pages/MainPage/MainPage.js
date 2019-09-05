import React, { Component } from "react";
// import classnames from "classnames";

import Layout from "../../hoc/Layout/Layout";
import Feed from "../../components/Feed/Feed";
// import { userInfo } from "../../common/states/user-info";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  render() {
    return (
      <Layout>
        <Feed hasProfile={false} history={this.props.history} />
      </Layout>
    );
  }
}
export default MainPage;
