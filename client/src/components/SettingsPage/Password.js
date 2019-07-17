import React, { Component } from "react";


class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props)
    return (
      <form id="setting-form">
        <h2>Password</h2>

        <div className="field">
          <label>New Password</label>
          <input type="password" name="new_password" maxLength="32" autoComplete="off" />
        </div>
        <div className="field">
          <label>Re-type New Password</label>
          <input type="password" name="new_password_repeat" maxLength="32" autoComplete="off" />
        </div>
        <div className="btn-setting-container">
          <input type="submit" value="Save Changes" />
        </div>
      </form>
    );
  }
}

export default Password;
