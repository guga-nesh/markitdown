import { LOGIN, UPDATE_NOTE } from "./actionTypes";

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