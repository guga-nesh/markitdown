import { UPDATE_NOTE } from "../actionTypes";
import Note from "../../model/note";

const initialState = {
    ...Note.getPlaceHolderNote()
}

export default function(state = initialState, action) {
    switch(action.type) {
        
        case UPDATE_NOTE: {
            const { noteBeingModified } = action.payload;
            return {
                ...state,
                ...noteBeingModified
            }
        }

        default:
            return state;
    }
}