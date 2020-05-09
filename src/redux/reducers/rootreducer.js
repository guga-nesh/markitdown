import { combineReducers } from "redux";
import user from "./user";
import noteBeingModified from "./noteBeingModified";
import noteList from './notelist';

export default combineReducers({ user, noteBeingModified, noteList});