import React, { Component } from "react";
import HeaderSearchDropdown from "../HeaderSearchDropdown/HeaderSearchDropdown";

class GeneralFunction extends Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.state = {
      visibility: false,
      clickedOutside: false
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

  render() {
    return (
      <span>
        <div className="general-function">
          <button id="header-darkmode-btn" className="darkmode-toggle" >
            Dark mode
          </button>
          <button
            id="header-search-btn"
            className="search"
            onClick={this.handleToggleVisibility}
          >
            Search
          </button>
        </div>
        <span ref={this.setWrapperRef}>
          {this.state.visibility && (
            <HeaderSearchDropdown />
          )}
        </span>
      </span>
    );
  }
}

export default GeneralFunction;
