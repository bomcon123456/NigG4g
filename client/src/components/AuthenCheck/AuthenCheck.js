import { withRouter } from "react-router-dom";
import { KComponent } from "../KComponent";
import { userInfo } from "../../common/states/user-info";

class AuthenCheck extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onUnmount(
      userInfo.onChange((newState, oldState) => {
        if (!newState || !oldState) {
          props.history.push("/");
        }
      })
    );
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(AuthenCheck);
