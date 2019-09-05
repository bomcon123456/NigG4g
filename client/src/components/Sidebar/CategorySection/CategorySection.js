import React from "react";
import Category from "./Category/Category";
import { categoryCache } from "../../../common/cache/api-cache/common-cache";

import MoreDropdown from "../PopularSidebar/MoreDropdown/MoreDropdown";

class CategorySection extends React.Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.state = {
      name: "",
      visibility: false
    };

    const cachedCategory = categoryCache.syncGet();
    this.categories = cachedCategory ? cachedCategory : [];
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
      <div className="category-div">
        <header>
          <h3>Sections</h3>
        </header>
        <ul className="nav">
          <Category
            name="Vietnam 🇻🇳"
            description="Everything about Vietnam"
            imageUrl="https://localhost:6969/assets/0_country_100.jpg"
            iconType="more"
            handleToggleVisibility={this.handleToggleVisibility}
          />
          {this.state.visibility && <MoreDropdown />}
          {this.categories.map(category => {
            if (
              category.imageUrl !==
              "https://localhost:6969/assets/0_country_100.jpg"
            )
              return (
                <Category
                  key={category.name}
                  name={category.name}
                  description={category.description}
                  imageUrl={category.imageUrl}
                  iconType="star"
                />
              );
          })}
        </ul>
      </div>
    );
  }
}

export default CategorySection;
