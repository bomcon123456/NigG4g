import React, { Component } from "react";
import classnames from "classnames";

export class InputBase extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      error = false,
      label = null,
      helper = null,
      id,
      inputType = "input",
      ...other
    } = this.props;

    let input = null;
    switch (inputType) {
      case "input":
        input = (
          <input
            type="text"
            className={classnames("form-control", {
              "is-invalid": error
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
              "is-invalid": error
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
              "is-invalid": error
            })}
            id={id}
            {...other}
          />
        );
        break;
    }

    return (
      <div
        className={classnames("form-group", className, {
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
