import React from "react";
import GeneralFuntion from "./GeneralFunction/GeneralFunction";
import VisitorFunction from "./VisitorFunction/VisitorFunction";
import UserFunction from "./UserFunction/UserFunction";
import { userInfo } from "../../../../src/common/states/user-info";
import { NavLink } from "react-router-dom";
import HeaderSearchDropdown from "./HeaderSearchDropdown/HeaderSearchDropdown"


const isLogin = userInfo.getState();

const FunctionWrap = props => (
  <div className="function-wrap">
    <GeneralFuntion />
    {!isLogin && <VisitorFunction />}
    {isLogin && <UserFunction />}

  </div>
);

export default FunctionWrap;