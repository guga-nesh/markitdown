import { UPDATE_NOTE_LIST } from "../actionTypes";
import Note from "../../model/note";

const initialState = {
    noteList: Note.getPlaceHolderNotes()
}

export default function(state = initialState, action) {
    switch(action.type) {
        
        case UPDATE_NOTE_LIST: {
            const { updatedNoteList } = action.payload;
            return {
                noteList: updatedNoteList
            }
        }

        default:
            return state;
    }
}
