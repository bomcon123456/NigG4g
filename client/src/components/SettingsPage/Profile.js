/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { userInfo } from "../../common/states/user-info"

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: userInfo.getState()
    };
  }

  render() {
    console.log(userInfo.getState());
    return (
      <form id="setting-form">
        <h2>Profile</h2>

        <div className="field avatar">
          <label>Avatar</label>
          <div className="avatar-content">
            <div className="avatar-container">
              <div>
                <img
                  src={this.state.data.avatarURL}
                  alt="avatar"
                />
              </div>
            </div>

            <div className="control">
              <input type="file" name="avatar" accept=".jpg, .gif, .png" />
              <p className="tips">JPG, GIF or PNG, Max size: 2MB</p>
              <Link to="#">Random</Link>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Your Name</label>
          <input
            type="text"
            name="fullName"
            defaultValue={this.state.data.username}
            maxLength="20"
          />
          <p className="tips">
            This is the name that will be visible to other users on 9GAG.
          </p>
        </div>
        <div className="field">
          <label>Status</label>
          <select name="emojiStatus">
            <option value="">None</option>
            <option value="🎃">🎃 Jack-O-Lantern</option>
            <option value="💀">💀 Skull</option>
            <option value="👻">👻 Ghost</option>
            <option value="🧛">🧛 Vampire</option>
            <option value="🧟">🧟 Zombie</option>
            <option value="🦇">🦇 Bat</option>
          </select>
        </div>

        <div className="field">
          <label>Gender</label>
          <select name="gender">
            <option>Select Gender...</option>
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="X">Unspecified</option>
          </select>
        </div>

        <div className="field">
          <label>Birthday</label>
          <div className="date-picker">
            <input
              className="year"
              type="text"
              name="dob_year"
              placeholder="YYYY"
            />
            <input
              className="month"
              type="text"
              name="dob_month"
              placeholder="MM"
            />
            <input
              className="day"
              type="text"
              name="dob_day"
              placeholder="DD"
            />
          </div>
        </div>

        <div className="field">
          <label>Country</label>
          <select name="country" id="country_selector">

          </select>
          <p className="tips">Tell us where you're from so we can provide better service for you.</p>
        </div>

        <div className="field">
          <label>Tell people who you are</label>
          <textarea name="blogTitle" maxLength="120" defaultValue="My Funny Collection"></textarea>
        </div>

        <div className="setting-social-connect">
          <label>Social Networks</label>

          <div className="connection">
            <div className="field social">
              <p className="label">Facebook connected</p>
              <button className="my-blue-button">Connect now</button>
            </div>
          </div>

          <div className="connection">
            <div className="field">
              <p className="label">Google not connected</p>
              <button className="my-blue-button">Connect now</button>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Your 9GAG Data</label>
          <p className="tips">You can <Link to="#">request</Link> a PDF with your 9GAG data. We’ll send it to your email once ready.</p>
        </div>

        <div className="my-btn-container">
          <input type="submit" value="Save Changes" />
        </div>

      </form>
    );
  }
}

export default Profile;
