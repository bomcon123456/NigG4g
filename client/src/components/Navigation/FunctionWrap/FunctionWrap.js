import React from "react";
import GeneralFuntion from "./GeneralFunction/GeneralFunction";
import VisitorFunction from "./VisitorFunction/VisitorFunction";
import UserFunction from "./UserFunction/UserFunction";
import { userInfo } from "../../../../src/common/states/user-info";
import { NavLink } from "react-router-dom";

const FunctionWrap = props => (
  <div className="function-wrap">
    <GeneralFuntion />
    {!userInfo.getState() && <VisitorFunction />}
    {userInfo.getState() && <UserFunction />}
  </div>

);

export default FunctionWrap;