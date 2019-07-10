import React, { Component } from "react";
import classnames from "classnames";

export class InputBase extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      className,
      error = false,
      success = false,
      label = null,
      helper = null,
      id,
      icon, // Icon Styl currently work with: <i className="fas fa-spinner spin" />
      inputType = "input",
      ...other
    } = this.props;
    let input = null;
    switch (inputType) {
      case "input":
        input = icon ? (
          <input
            type="text"
            className={classnames("form-control", {
              "is-invalid": error,
              "is-valid": success
            })}
            id={id}
            {...other}
          />
        ) : (
          <input
            type="text"
            className={classnames("form-control", {
              "is-invalid": error,
              "is-valid": success
            })}
            id={id}
            {...other}
          />
        );
        break;
      case "text-area":
        input = (
          <textarea
            type="text"
            className={classnames("form-control", {
              "is-invalid": error,
              "is-valid": success
            })}
            id={id}
            {...other}
          />
        );
        break;
      default:
        input = (
          <input
            type="text"
            className={classnames("form-control", {
              "is-invalid": error,
              "is-valid": success
            })}
            id={id}
            {...other}
          />
        );
        break;
    }

    if (icon) {
      input = (
        <div className="input-with-icon">
          {input}
          <span className="input-icon">
            <span>{icon}</span>
          </span>
        </div>
      );
    }

    return (
      <div
        className={classnames("form-group", className, {
          // "has-success": success,
          "has-error": error
        })}
      >
        {label && (
          <label className="input-base-label" htmlFor={id}>
            {label}
          </label>
        )}
        {input}
        {error && (
          <div className="input-base-feedback" id={id} {...other}>
            {error.message}
          </div>
        )}
        {helper && (
          <div className="input-base-help " id={id} {...other}>
            {helper}
          </div>
        )}
      </div>
    );
  }
}
