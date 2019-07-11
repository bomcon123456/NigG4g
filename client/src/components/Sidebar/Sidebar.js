import React from "react";
import PopularSidebar from "./PopularSidebar/PopularSidebar";
import CategorySection from "./CategorySection/CategorySection"

const Sidebar = props => {
  return (
    <div className="section-sidebar">
      <div className="stealthy-scroll-container">
        <div className="inside-section">
          <PopularSidebar />
          <CategorySection />
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
