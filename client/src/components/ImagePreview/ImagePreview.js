import React from "react";
import { LoadingInline } from "../../common/react/loading-inline/loading-inline";

const imagePreview = props => (
  <div className="image-preview">
    {props.src ? <img src={props.src} alt="comment" /> : <LoadingInline />}
    <div className="ip-overlay">
      {props.src ? (
        <i className="fas fa-times" onClick={props.onClose} />
      ) : null}
    </div>
  </div>
);

export default imagePreview;
