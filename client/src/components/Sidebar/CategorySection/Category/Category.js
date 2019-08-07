import React from "react";
import { Link } from "react-router-dom";

class Category extends React.Component {
  render() {
    return (
      <li>
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
          <button className="my-button " onClick={this.props.iconType === "more" ? this.props.handleToggleVisibility : null}>
            <i className={"icon icon-right " + `${this.props.iconType}`} />
          </button>
          <p className="test">{this.props.name}</p>
        </div>
      </li>
    );
  }
}

export default Category;
