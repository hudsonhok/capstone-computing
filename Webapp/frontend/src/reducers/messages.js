import { GET_MESSAGE, CREATE_MESSAGE } from "../actions/types";

const initialState = {};

export default function(state = initialState, action){
    switch(action.type){
        // When either actions are dispatched
        case GET_MESSAGE:
            // Set the state to the message received in the action payload
            return action.payload;
        case CREATE_MESSAGE:
            // Set the state to the new message created in the action payload
            return (state = action.payload);
        default: 
            return state;
    }
}