import React, { Component } from "react";
import classnames from "classnames";
import customCheckbox from "../../../assets/img/custom-checkbox.png";

class SectionPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      currentSection: this.props.defaultSection
        ? this.props.defaultSection
        : null
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
                  style={{
                    height: each.imageUrl ? "" : "20px"
                  }}
                  onClick={() => {
                    handleClick(each);
                    this.setState({ currentSection: each });
                  }}
                >
                  {each.imageUrl ? (
                    <img
                      className="section-icon"
                      src={each.imageUrl}
                      alt="icon"
                    />
                  ) : null}
                  <div
                    className="section-text"
                    style={{
                      margin: each.imageUrl ? "" : "0px"
                    }}
                  >
                    <h3
                      className="section-title"
                      style={{
                        fontWeight: each.imageUrl ? "" : "bold"
                      }}
                    >
                      {each.name}
                    </h3>
                    {each.description ? (
                      <p className="section-subtitle">{each.description}</p>
                    ) : null}
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
