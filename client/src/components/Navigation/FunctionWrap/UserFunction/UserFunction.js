import React from "react";
import { Link } from "react-router-dom";

const UserFunction = props => (
  <div className="user-function">
    <div className="notification">
      <button className="bell" to="/"></button>
    </div>
    <div className="avatar">
      <Link className="avatar-container" onClick={null} to="#">
        <img id="avatar" src="https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/65779034_2581715215269851_5487272615624048640_n.jpg?_nc_cat=103&_nc_oc=AQnHo4OFV2vph0EFQGpXEwFBgdxVAIRMQeDc9cqPCxokqfvcGFD6xW-PsK8IDU47JZA&_nc_ht=scontent.fhan2-1.fna&oh=dc220778d9eb228dc150dc2b3b701803&oe=5DB46B7B" alt="avatar" />
      </Link>
    </div>
    <div className="upload">
      <button id="upload-btn" className="my-btn-primary" to="/">Upload</button>
    </div>

  </div>

);

export default UserFunction;