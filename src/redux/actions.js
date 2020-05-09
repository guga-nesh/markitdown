import { LOGIN, UPDATE_NOTE_BEING_MODIFIED, UPDATE_NOTE_LIST, SELECT_NOTE, LOGOUT } from "./actionTypes";

export const login = content => ({
    type: LOGIN,
    payload: {
        user: content.user
    }
});

export const selectNote = content => ({
    type: SELECT_NOTE,
    payload: {
        selectedNote: content.selectedNote
    }
});

export const updateNoteBeingModified = content => ({
    type: UPDATE_NOTE_BEING_MODIFIED,
    payload: {
        noteBeingModified: content.noteBeingModified
    }
});

export const updateNoteList = content => ({
    type: UPDATE_NOTE_LIST,
    payload: {
        updatedNoteList: content.updatedNoteList
    }
});

export const logout = content => ({
    type: LOGOUT,
    payload: {
        user: null
    }
});