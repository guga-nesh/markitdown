import { combineReducers } from "redux";
import userState from "./userState";
import noteBeingModifiedState from "./noteBeingModifiedState";
import noteListState from './noteListState';

export default combineReducers({ userState, noteBeingModifiedState, noteListState});