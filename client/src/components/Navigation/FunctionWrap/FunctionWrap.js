import React from "react";
import GeneralFuntion from "./GeneralFunction/GeneralFunction";
import VisitorFunction from "./VisitorFunction/VisitorFunction";
import UserFunction from "./UserFunction/UserFunction";
import { userInfo } from "../../../../src/common/states/user-info";

const FunctionWrap = props => {
  const isLogin = userInfo.getState();
  return (
    <div className="function-wrap">
      <GeneralFuntion />
      {!isLogin && <VisitorFunction history={props.history} />}
      {isLogin && (
        <UserFunction
          history={props.history}
          handleLogOut={props.handleLogOut}
        />
      )}
    </div>
  );
};

export default FunctionWrap;
