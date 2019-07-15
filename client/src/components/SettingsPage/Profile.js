import React, { Component } from "react";
import { Link } from "react-router-dom";


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props)
    return (
      <form id="setting-form">
        <h2>Profile</h2>

        <div className="field avatar">
          <label>Avatar</label>
          <div className="avatar-content">
            <div className="avatar-container">
              <div>
                <img src="https://accounts-cdn.9gag.com/media/avatar/52335846_100_1.jpg" />
              </div>
            </div>

            <div className="control">
              <input type="file" name="avatar" accept=".jpg, .gif, .png" />
              <p class="tips">JPG, GIF or PNG, Max size: 2MB</p>
              <Link to="#">Random</Link>
            </div>
          </div>
        </div>



        <div className="field">
          <label>Your Name</label>
          <input type="text" name="fullName" defaultValue="Minh Nguyen" maxlength="20" />
          <p className="tips">This is the name that will be visible to other users on 9GAG.</p>
        </div>
        <div className="field">
          <label>Status</label>
          <select name="emojiStatus" >
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
            <input className="year" type="text" name="dob_year" placeholder="YYYY" />
            <input className="month" type="text" name="dob_month" placeholder="MM" />
            <input className="day" type="text" name="dob_day" placeholder="DD" />
          </div>
        </div>
      </form>
    );
  }
}

export default Profile;
