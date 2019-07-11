import React from "react";
import { Link } from "react-router-dom";
import Category from "./Category/Category"

class CategorySection extends React.Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.state = {
      name: '',
      visibility: false
    }
  }


  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleToggleVisibility(event) {
    if (!this.state.visibility) {
      document.addEventListener('click', this.handleClickOutside, false);
    } else {
      document.removeEventListener('click', this.handleClickOutside, false);
    }
    this.setState((prevState) => ({ visibility: !prevState.visibility }));

  }

  handleClickOutside(event) {
    if (this.wrapperRef && this.wrapperRef.contains(event.target)) {
      return;
    }
    this.handleToggleVisibility();
  }

  render() {
    return (
      <div>
        <header>
          <h3>Sections</h3>
        </header>
        <ul className="nav">
          <Category />
          <Category />

        </ul>
      </div>
    );
  }
};

export default CategorySection;
