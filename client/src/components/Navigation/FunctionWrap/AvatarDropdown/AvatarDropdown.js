import React from "react";

class AvatarDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div id="header-avatar-dropdown" className="popup-menu user">
        <ul>
          <li>
            <button onClick={() => console.log("hihdsifd")}>My Profile</button>
          </li>
          <li>
            <button>Settings</button>
          </li>
          <li>
            <button onClick={this.props.handleLogOut}>Logout</button>
          </li>
        </ul>
      </div>
    );
  }
}

export default AvatarDropdown;
