/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { Link } from "react-router-dom";
import { userInfo } from "../../common/states/user-info"
import { userApi } from "../../common/api/common/user-api";

import { KComponent } from "../KComponent";

import * as yup from "yup";
import { createFormWithValidator } from "../../common/react/form-validator/form-validator";
import { InputBase } from "../../common/react/input-base/input-base";

import Selector from "./Selector/Selector";
import { statusCache, countryCache } from "../../common/cache/api-cache/common-cache";

class Profile extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: userInfo.getState(),
      loading: false,
      error: "",
      optionStatus: userInfo.getState().statusId,
      optionCountry: userInfo.getState().country,
      optionGender: userInfo.getState().gender
    };

    const cachedStatus = statusCache.syncGet();
    this.status = cachedStatus.map(status => {
      return {
        key: `${status.alt} ${status.name}`,
        value: `${status._id}`
      }
    })

    const cachedCountry = countryCache.syncGet();
    this.countries = cachedCountry.map(country => {
      return {
        key: country.name,
        value: country._id
      }
    })

    this.profileSchema = yup.object().shape({
      name: yup
        .string()
        .min(2, "Username must be at least 2-char long.")
        .max(15, "Username max length is 15."),
      birthdayYear: yup
        .number()
        .integer(),
      birthdayMonth: yup
        .number()
        .integer(),
      birthdayDay: yup
        .number()
        .integer(),
      blogText: yup
        .string()
        .max(120, "Max length id 120")
    })

    const bd = new Date(this.state.data.birthday);
    const birthday = {
      year: bd !== null ? bd.getFullYear() : null,
      date: bd !== null ? bd.getDate() : null,
      month: bd !== null ? bd.getMonth() : null
    }

    console.log(birthday);
    this.form = createFormWithValidator(this.profileSchema, {
      initData: {
        name: this.state.data.name,
        birthdayYear: birthday.year,
        birthdayMonth: birthday.month,
        birthdayDay: birthday.date,
        blogText: "My funny collection"
      }
    });
    console.log(this.form.getData())

    this.onUnmount(this.form.on("change", () => this.forceUpdate()));

    this.form.validateData();
  }

  handleUpdateProfile = () => {
    const avatarUrl = userInfo.getState.avatarURL;
    const { name, birthdayYear, birthdayDay, birthdayMonth, blogText } = this.form.getData();
    const birthday = new Date(birthdayYear, birthdayMonth, birthdayDay);
    const status = this.state.optionStatus;
    const country = this.state.optionCountry;
    const gender = this.state.optionGender;

    userApi
      .updateProfile({ avatarUrl, name, status: status, country: country, gender: gender, birthday: birthday, description: blogText })
      .then(res => {
        if (res.data.message === "update_account_successfully") {
          this.setState({ loading: false });
          this.props.history.push("/");
        } else {
          this.setState({
            error: { message: "bad_error" },
            loading: false,
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          loading: false
        });
      });
  }

  handleSelectorStatus = (e) => {
    this.setState({
      optionStatus: e.target.value
    })
  }

  handleSelectorCountry = (e) => {
    alert(e.target.value)
    this.setState({
      optionCountry: e.target.value
    })
  }

  handleSelectorGender = (e) => {
    alert(e.target.value)
    this.setState({
      optionGender: e.target.value
    })
  }

  handleServerError = () => {
    const { error } = this.state;
    const message = error.message;
    let errorMatcher = {
      network_error: "Database is ded",
      account_not_found: "This user is not valid.",

    };
    return errorMatcher.hasOwnProperty(message)
      ? errorMatcher[message]
      : "Something bad happened.";
  };

  render() {
    console.log(this.state.data.birthday)
    const isSubmittable =
      this.form.getInvalidPaths().length === 0 &&
      this.state.error === "" &&
      !this.state.checking &&
      !this.state.loading
    return (
      <form id="setting-form">
        <h2>Profile</h2>

        <div className="field">
          {this.state.error && (
            <div className="server-error">{this.handleServerError()}</div>
          )}
        </div>

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
          {this.form.enhancedComponent(
            "name",
            ({ error, onChange, onEnter, ...others }) => (
              <InputBase
                maxLength="20"
                className=""
                error={error}
                onChange={e => {
                  onChange(e)
                }}
                type={"text"}
                icon={
                  this.state.loadingEmail ? (
                    <i className="fas fa-spinner spin" />
                  ) : null
                }
                {...others}
              />
            ),
            true
          )}
          <p className="tips">
            This is the name that will be visible to other users on 9GAG.
          </p>
        </div>
        <div className="field">
          <label>Status</label>
          <Selector name="emojiStatus" data={this.status} optionValue={this.state.optionStatus} handleSelector={this.handleSelectorStatus} />
        </div>

        <div className="field">
          <label>Gender</label>
          <Selector name="saveMode" data={[
            {
              value: "default",
              key: "Select Gender..."
            }, {
              value: "F",
              key: "Female"
            }, {
              value: "M",
              key: "Male"
            }, {
              value: "X",
              key: "Unspecified"
            }
          ]} optionValue={this.state.optionGender} handleSelector={this.handleSelectorGender} />
        </div>

        <div className="field">
          <label>Birthday</label>
          <div className="date-picker">
            {this.form.enhancedComponent(
              "birthdayYear",
              ({ error, onChange, onEnter, ...others }) => (
                <InputBase
                  placeholder="YYYY"
                  className="year"
                  error={error}
                  onChange={e => {
                    onChange(e)
                  }}
                  type={"number"}
                  icon={
                    this.state.loadingEmail ? (
                      <i className="fas fa-spinner spin" />
                    ) : null
                  }
                  {...others}
                />
              ),
              true
            )}
            {this.form.enhancedComponent(
              "birthdayMonth",
              ({ error, onChange, onEnter, ...others }) => (
                <InputBase
                  placeholder="MM"
                  className="month"
                  error={error}
                  onChange={e => {
                    onChange(e)
                  }}
                  type={"number"}
                  min="1"
                  max="12"
                  icon={
                    this.state.loadingEmail ? (
                      <i className="fas fa-spinner spin" />
                    ) : null
                  }
                  {...others}
                />
              ),
              true
            )}
            {this.form.enhancedComponent(
              "birthdayDay",
              ({ error, onChange, onEnter, ...others }) => (
                <InputBase
                  placeholder="DD"
                  className="day"
                  min="1"
                  max="31"
                  error={error}
                  onChange={e => {
                    onChange(e)
                  }}
                  type={"number"}
                  icon={
                    this.state.loadingEmail ? (
                      <i className="fas fa-spinner spin" />
                    ) : null
                  }
                  {...others}
                />
              ),
              true
            )}
          </div>
        </div>

        <div className="field">
          <label>Country</label>
          <Selector name="country" id="country_selector" data={this.countries} optionValue={this.state.optionCountry} handleSelector={this.handleSelectorCountry} />
          <p className="tips">Tell us where you're from so we can provide better service for you.</p>
        </div>

        <div className="field">
          <label>Tell people who you are</label>
          {this.form.enhancedComponent(
            "blogText",
            ({ error, onChange, onEnter, ...others }) => (
              <InputBase
                maxLength="120"
                type={"text-area"}
                className="my-txt-area"
                error={error}
                onChange={e => {
                  onChange(e)
                }}
                {...others}
              />
            ),
            true
          )}
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
          <button className="my-blue-button" disabled={!isSubmittable} onClick={this.handleUpdateProfile}>Save Changes</button>
        </div>

      </form>
    );
  }
}

export default Profile;
