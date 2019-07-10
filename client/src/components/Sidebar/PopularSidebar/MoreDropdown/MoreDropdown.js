import React from "react";
import { Link } from "react-router-dom";

const MoreDropdown = props => {
  return (
    <div className="more-dropdown">
      <ul>
        <li>
          <Link to="#">Top Posts</Link>
        </li>
        <li>
          <Link to="#">Most Recents</Link>
        </li>
      </ul>
    </div>
  );
};

export default MoreDropdown;
