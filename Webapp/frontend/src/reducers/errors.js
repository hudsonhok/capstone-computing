import { GET_ERRORS } from '../actions/types';

// Initial state for the error reducer
const initialState = {
  msg: {},
  status: null,
};
// Error reducer function
export default function (state = initialState, action) {
  switch (action.type) {
    // When GET_ERRORS action is dispatched, it updates the state with the error message and status provided in the action payload
    // This allows the application to track and display error information in response to specific actions.
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
      };
    default:
      return state;
  }
}