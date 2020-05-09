import { UPDATE_NOTE_BEING_MODIFIED } from "../actionTypes";

const initialState = {
    noteBeingModified: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        
        case UPDATE_NOTE_BEING_MODIFIED: {
            const { noteBeingModified } = action.payload;
            return {
                ...state,
                noteBeingModified: noteBeingModified
            }
        }

        default:
            return state;
    }
}