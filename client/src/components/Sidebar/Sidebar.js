import React from "react";
import PopularSidebar from "./PopularSidebar/PopularSidebar";
import CategorySection from "./CategorySection/CategorySection";
import { Link } from "react-router-dom";


const Sidebar = props => {
  return (
    <div className="section-sidebar">
      <div className="stealthy-scroll-container">
        <div className="inside-section">
          <PopularSidebar />
          <CategorySection />
          <section className="footer">
            <p className="static">
              <Link to="#">Advertise</Link>
              <Link to="#">Rules</Link>
              <Link to="#">Tips</Link>
              <Link to="#">FAQ</Link>
              <Link to="#">Terms</Link>
              <Link to="#">Privacy</Link>
              <Link to="#">Jobs</Link>
              <Link to="#">Contact</Link>
              <Link to="#">Feedback</Link>
              <Link to="#">Report Bad Ads</Link>
            </p>
            <p className="static">9GAG © 2019</p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
