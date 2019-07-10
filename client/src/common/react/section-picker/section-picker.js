import React, { Component } from "react";
import { categoryCache } from "../../cache/api-cache/common-cache";
import classnames from "classnames";
import customCheckbox from "../../../assets/img/custom-checkbox.png";

class SectionPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      currentSection: null
    };
  }

  render() {
    const { className, handleClick } = this.props;
    const { data, currentSection } = this.state;
    return (
      <div className={classnames("section-picker", className)}>
        <ul className="section-list">
          {data.map(each => {
            return (
              <li key={each.name} className="section">
                <div
                  className="section-container"
                  onClick={() => {
                    handleClick(each);
                    this.setState({ currentSection: each });
                  }}
                >
                  <img
                    className="section-icon"
                    src={each.imageUrl}
                    alt="icon"
                  />
                  <div className="section-text">
                    <h3 className="section-title">{each.name}</h3>
                    <p className="section-subtitle">{each.description}</p>
                  </div>
                  {currentSection !== each ? (
                    <div className="section-selector" />
                  ) : (
                    <img
                      className="section-selector selected"
                      src={customCheckbox}
                      alt="Checkbox"
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default SectionPicker;
