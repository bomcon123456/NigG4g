import React from "react";
import HeaderSearchDropdown from "../HeaderSearchDropdown/HeaderSearchDropdown"


class GeneralFunction extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.state = {
      visibility: false
    }
  }

  handleToggleVisibility() {
    this.setState((prevState) => ({ visibility: !prevState.visibility }));
  }

  render() {
    return (
      <span>
        <div className="general-function">
          <button id="header-darkmode-btn" className="darkmode-toggle" >Dark mode</button>
          <button id="header-search-btn" className="search" onClick={this.handleToggleVisibility} >Search</button>
        </div>
        {this.state.visibility && (
          <HeaderSearchDropdown />
        )}
      </span>
    )
  }
}

export default GeneralFunction;