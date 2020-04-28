import { LOGIN } from "../actionTypes";

const initialState = {
    user: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        
        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                user: user
            }
        }

        default:
            return state;
    }
}