import { LOGIN, UPDATE_NOTE, UPDATE_NOTE_LIST } from "./actionTypes";

export const login = content => ({
    type: LOGIN,
    payload: {
        user: content.user
    }
})

export const updateNote = content => ({
    type: UPDATE_NOTE,
    payload: {
        noteBeingModified: content.noteBeingModified
    }
})

export const updateNoteList = content => ({
    type: UPDATE_NOTE_LIST,
    payload: {
        updatedNoteList: content.updatedNoteList
    }
})