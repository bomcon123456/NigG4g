import React from "react";
import { Link } from "react-router-dom";
import { userInfo } from "../../../../common/states/user-info";
import { uploadPostModal } from "../../../../common/react/modals/upload-post/upload-post";
import AvatarDropdown from "../AvatarDropdown/AvatarDropdown";
class UserFunction extends React.Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.state = {
      visibility: false
    };
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleToggleVisibility(event) {
    if (!this.state.visibility) {
      document.addEventListener("click", this.handleClickOutside, false);
    } else {
      document.removeEventListener("click", this.handleClickOutside, false);
    }
    this.setState(prevState => ({ visibility: !prevState.visibility }));
  }

  handleClickOutside(event) {
    if (this.wrapperRef && this.wrapperRef.contains(event.target)) {
      return;
    }
    this.handleToggleVisibility();
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, false);
  }

  render() {
    const { avatarURL } = userInfo.getState();

    return (
      <div className="user-function">
        <div className="notification">
          <button className="bell" to="/" />
        </div>
        <div className="avatar">
          <Link
            className="avatar-container"
            onClick={this.handleToggleVisibility}
            to="#"
          >
            <img
              id="avatar"
              src={
                avatarURL
                  ? avatarURL
                  : "https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/65779034_2581715215269851_5487272615624048640_n.jpg?_nc_cat=103&_nc_oc=AQnHo4OFV2vph0EFQGpXEwFBgdxVAIRMQeDc9cqPCxokqfvcGFD6xW-PsK8IDU47JZA&_nc_ht=scontent.fhan2-1.fna&oh=dc220778d9eb228dc150dc2b3b701803&oe=5DB46B7B"
              }
              alt="avatar"
            />
          </Link>
        </div>
        <div className="upload">
          <button
            id="upload-btn"
            className="my-btn-primary"
            onClick={() => {
              uploadPostModal.open(redirect => {
                this.props.history.push(redirect);
              });
            }}
          >
            Upload
          </button>
        </div>
        {this.state.visibility && (
          <AvatarDropdown handleLogOut={this.props.handleLogOut} />
        )}
      </div>
    );
  }
}

export default UserFunction;
