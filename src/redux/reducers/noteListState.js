import { UPDATE_NOTE_LIST, SELECT_NOTE } from "../actionTypes";

const initialState = {
    noteList: [],
    selectedNote: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        
        case UPDATE_NOTE_LIST: {
            const { updatedNoteList } = action.payload;
            return {
                ...state,
                noteList: updatedNoteList
            }
        }

        case SELECT_NOTE: {
            const { selectedNote } = action.payload;
            return {
                ...state,
                selectedNote: selectedNote
            }
        }

        default:
            return state;
    }
}
