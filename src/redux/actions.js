import { LOGIN } from "./actionTypes";

export const login = content => ({
    type: ADD_TODO,
    payload: {
        user: content.user
    }
})