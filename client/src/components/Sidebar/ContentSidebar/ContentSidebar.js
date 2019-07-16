import React from "react";
import Article from "./Article/Article";

class ContentSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div id="content-sidebar">
        <div className="stealthy-scroll-container padding-top ">
          <div className="content">
            <div className="block-feature-cover">
              <ul>
                <Article
                  img="https://miscmedia-9gag-fun.9cache.com/images/featured/1562507503.3532_vEBADE_300.jpg"
                  info="Florida Hunter Shoots Pool Worker After Mistaking Him For Green Iguana"
                />
                <Article
                  img="https://miscmedia-9gag-fun.9cache.com/images/featured/1562507503.3532_vEBADE_300.jpg"
                  info="Florida Hunter Shoots Pool Worker After Mistaking Him For Green Iguana"
                />
                <Article
                  img="https://miscmedia-9gag-fun.9cache.com/images/featured/1562507503.3532_vEBADE_300.jpg"
                  info="Florida Hunter Shoots Pool Worker After Mistaking Him For Green Iguana"
                />
                <Article
                  img="https://miscmedia-9gag-fun.9cache.com/images/featured/1562507503.3532_vEBADE_300.jpg"
                  info="Florida Hunter Shoots Pool Worker After Mistaking Him For Green Iguana"
                />
                <Article
                  img="https://miscmedia-9gag-fun.9cache.com/images/featured/1562507503.3532_vEBADE_300.jpg"
                  info="Florida Hunter Shoots Pool Worker After Mistaking Him For Green Iguana"
                />
                <Article
                  img="https://miscmedia-9gag-fun.9cache.com/images/featured/1562507503.3532_vEBADE_300.jpg"
                  info="Florida Hunter Shoots Pool Worker After Mistaking Him For Green Iguana"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContentSidebar;
