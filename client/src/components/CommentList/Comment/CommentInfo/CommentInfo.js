import React from "react";
import { Link } from "react-router-dom";

const commentInfo = props => (
  <p className="comment-info">
    <Link className="username" to={props.redirect}>
      {props.user.username}
    </Link>
    <span className="status">
      <img />
    </span>
  </p>
);

export default commentInfo;
