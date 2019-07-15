import React from "react";
import { Link } from "react-router-dom";

class AvatarDropdown extends React.Component {
  render() {
    return (
      <div id="header-avatar-dropdown" className="popup-menu user">
        <ul>
          <li>
            <Link to="#" onClick={() => console.log("hihdsifd")}>My Profile</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="#">Logout</Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default AvatarDropdown;