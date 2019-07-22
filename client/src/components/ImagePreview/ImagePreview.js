import React from "react";

const imagePreview = props => (
  <div className="image-preview">
    <img src={props.src} alt="comment" />
    <div className="ip-overlay">
      <i className="fas fa-times" onClick={props.onClose} />
    </div>
  </div>
);

export default imagePreview;
