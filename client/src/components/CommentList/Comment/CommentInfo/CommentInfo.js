import React from "react";
import { Link } from "react-router-dom";
import { statusCache } from "../../../../common/cache/api-cache/common-cache";
import { timeDifference } from "../../../../common/utils/common-util";

const commentInfo = props => {
  const { user, points, createdAt } = props;
  let date = new Date(createdAt);
  const time = timeDifference(date);
  let redirect = `${process.env.REACT_APP_APP_URL}/u/${user.username}`;
  let status = statusCache.syncGet();
  let statusObject = status.find(each => each._id === user.statusId);
  let showStatus = statusObject && statusObject.name !== "None";
  return (
    <p className="comment-info">
      <Link className="username" to={redirect}>
        {user.username}
      </Link>
      {showStatus ? (
        <span className="status">
          <img
            draggable="false"
            className="emoji"
            alt={statusObject.alt}
            src={statusObject.src}
          />
        </span>
      ) : null}
      {user.isPro ? <span className="pro-badge">Pro</span> : null}
      <span className="meta">
        {user.username === props.postCreatedBy ? (
          <span title="Original Poster" className="role-op">
            OP
          </span>
        ) : null}
        {points ? <span className="points">{points} points</span> : null}
        {points ? <span> · </span> : null}
        <span className="time">
          <a href="/" target="_blank" className="comment-link">
            {time}
          </a>
        </span>
      </span>
    </p>
  );
};

export default commentInfo;
