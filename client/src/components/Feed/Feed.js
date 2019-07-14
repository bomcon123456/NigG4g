import React, { Component } from "react";
import classnames from "classnames";

import ProfileTag from "./ProfileTag/ProfileTag";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { className, hasProfile } = this.props;
    return (
      <div className={classnames("feed", className)}>
        {hasProfile ? <ProfileTag title="Area 51" /> : null}
      </div>
    );
  }
}

export default Feed;
