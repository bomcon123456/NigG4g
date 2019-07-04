import React from "react";
import classnames from "classnames";

export function LoadingInline({className}) {
  return (
    <div className="loading-inline">
      <div className="overlay row justify-content-center align-items-center">
        <i className={classnames("fa fa-circle-notch spin-icon spin", className)}/>
      </div>

    </div>

  );
}
