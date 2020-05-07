import { combineReducers } from "redux";
import user from "./user";
import noteBeingModified from "./noteBeingModified";

export default combineReducers({ user, noteBeingModified });