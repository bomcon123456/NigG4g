import React, { Component } from "react";
import { userInfo } from "../../common/states/user-info"


class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: userInfo.getState()
    };

  }

  render() {
    console.log(this.state.data)

    console.log()
    return (
      <form id="setting-form">
        <h2>Account</h2>

        <div className="field">
          <label>Username</label>
          <input type="text" name="login_name" defaultValue={this.state.data.username} maxLength="15" />
          <p className="tips">https://9gag.com/u/{"need change"}</p>
        </div>
        <div className="field">
          <label>Email</label>
          <input type="text" name="login_name" defaultValue={this.state.data.email} maxLength="200" />
          <p className="tips">Email will not be displayed publicly</p>
        </div>
        <div className="field">
          <label>Mask Sensitive Content</label>
          <select name="saveMode">
            <option value="1">On</option>
            <option value="0">Off</option>
          </select>
        </div>
        <div className="field">
          <label>Show Sensitive Content</label>
          <select name="nsfwMode">
            <option value="1">On</option>
            <option value="0">Off</option>
          </select>
        </div>
        <div className="btn-setting-container">
          <input type="submit" value="Save Changes" />
        </div>
      </form>
    );
  }
}

export default Account;
