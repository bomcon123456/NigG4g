import React from "react";
import { Link } from "react-router-dom";
import MoreDropdown from "./MoreDropdown/MoreDropdown"

class PopularSidebar extends React.Component {
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
      <div className="popular">
        <header>
          <h3>Popular</h3>
        </header>
        <ul className="nav">
          <li className={this.state.name === 'hot' ? 'selected' : ''}>
            <div className="div-button" onClick={() => { this.setState({ name: 'hot' }) }}>
              <Link to="#" className="label" >
                <i className="icon hot"></i>
                Hot
              </Link>
              <button className="my-button" onClick={this.handleToggleVisibility}>
                <i className="icon icon-right more"></i>
              </button>
            </div>
            {this.state.visibility && (
              <MoreDropdown />
            )}
          </li>
          <li className={this.state.name === 'trending' ? 'selected' : ''} >
            <div className="div-button" onClick={() => { this.setState({ name: 'trending' }) }}>
              <Link to="#" className="label" >
                <i className="icon trending"></i>
                Trending
              </Link>
            </div>
          </li>
          <li className={this.state.name === 'fresh' ? 'selected' : ''} >
            <div className="div-button" onClick={() => { this.setState({ name: 'fresh' }) }}>
              <Link to="#" className="label" >
                <i className="icon fresh"></i>
                Fresh
              </Link>
            </div>
          </li>
        </ul>
      </div>
    );
  }
};

export default PopularSidebar;
