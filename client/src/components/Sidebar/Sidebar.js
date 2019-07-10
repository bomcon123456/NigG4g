import React from "react";
import PopularSidebar from "./PopularSidebar/PopularSidebar"

const Sidebar = props => {
  return (
    <div className="section-sidebar">
      <div className="stealthy-scroll-container">
        <PopularSidebar />
      </div>
    </div>
  );
};

export default Sidebar;
