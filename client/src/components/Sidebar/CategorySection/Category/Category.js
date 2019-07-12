import React from "react";
import { Link } from "react-router-dom";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.state = {
      visibility: false
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
      <li key={this.props.name}>
        <div className="div-button" onClick={null}>
          <Link to="#" className="label">
            <i className="icon hot">
              <img
                className="icon hot"
                src={this.props.imageUrl}
                alt={this.props.name}
              />
            </i>
          </Link>
          <button className="my-button " onClick={this.handleToggleVisibility}>
            <i className="icon icon-right star" />
          </button>
          <p className="test">{this.props.name}</p>
        </div>
      </li>
    );
  }
}

export default Category;
