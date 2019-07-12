import React from "react";

class HeaderSearchDropdown extends React.Component {
  render() {
    return (
      <div id="header-search-dropdown" className="popup-menu search">
        <form id="headbar-search" onSubmit={null}>
          <div className="headbar-search">
            <input type="text" id="search-input" className="search-input" placeholder="Type to search..." />
          </div>
        </form>
      </div>
    )
  }
}

export default HeaderSearchDropdown;