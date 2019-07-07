import React, { Component } from "react";

import { userApi } from "../../common/api/common/user-api";
import { authenCache } from "../../common/cache/authen-cache";
import { userInfo } from "../../common/states/user-info";

export default class VerifyAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const search = new URLSearchParams(this.props.location.search);
    const token = search.get("token");
    userApi.getVerifyUser(token).then(data => {
      authenCache.setAuthen(data.data.token, { expire: 1 });
      userInfo
        .setState(data.data.user)
        .then(() => {
          this.props.history.push("/");
        })
        .catch(err => {});
    });
  }

  render() {
    return <div />;
  }
}
