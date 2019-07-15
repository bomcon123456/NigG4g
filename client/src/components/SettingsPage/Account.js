import React, { Component } from "react";


class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props)
    return (
      <form id="setting-form">
        <h2>Account</h2>

        <div className="field">
          <label>Username</label>
          <input type="text" name="login_name" defaultValue="chirikotomato" maxlength="15" />
          <p class="tips">https://9gag.com/u/chirikotomato</p>
        </div>
        <div className="field">
          <label>Email</label>
          <input type="text" name="login_name" defaultValue="chirikotomato@yahoo.com" maxlength="200" />
          <p class="tips">Email will not be displayed publicly</p>
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
      </form>
    );
  }
}

export default Account;
