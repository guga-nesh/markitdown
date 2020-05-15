import { combineReducers } from "redux";
import userState from "./userState";
import noteListState from './noteListState';

export default combineReducers({ userState, noteListState});