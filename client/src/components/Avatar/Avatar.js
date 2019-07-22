import React from "react";
import { Link } from "react-router-dom";

const avatar = props => (
  <div className="image-container">
    <Link to={props.redirect}>
      <img src={props.src} alt="avatar" />
    </Link>
  </div>
);

export default avatar;
