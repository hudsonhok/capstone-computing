import { GET_EVENTS, ADD_EVENT, DELETE_EVENT, UPDATE_EVENT, 
	FETCH_ATTENDED_MEETINGS_COUNT_FAIL, FETCH_ATTENDED_MEETINGS_COUNT_SUCCESS, 
	FETCH_UNATTENDED_MEETINGS_COUNT_FAIL, FETCH_UNATTENDED_MEETINGS_COUNT_SUCCESS } from '../actions/types.js';

const initialState = {
	events: [],
	attendedMeetingsCount: 0,
	unattendedMeetingsCount: 0,
	meetingsCountError: null
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_EVENTS:
			return {
				...state,
				events: action.payload,
			};
		case ADD_EVENT:
			return {
				...state,
				events: [...state.events, action.payload],
			};
		case DELETE_EVENT:
			return {
				...state,
				events: state.events.filter((event) => event.id !== action.payload),
			};
		case UPDATE_EVENT:
			return {
				...state,
				events: state.events.map((event) => event.id === action.payload.id ? action.payload : event),
			};
		case FETCH_ATTENDED_MEETINGS_COUNT_SUCCESS:
			return {
				...state,
				attendedMeetingsCount: action.payload,
				meetingsCountError: null
			};
		case FETCH_ATTENDED_MEETINGS_COUNT_FAIL:
			return {
				...state,
				meetingsCountError: action.payload
			};
		case FETCH_UNATTENDED_MEETINGS_COUNT_SUCCESS:
			return {
				...state,
				unattendedMeetingsCount: action.payload,
				meetingsCountError: null
			};
		case FETCH_ATTENDED_MEETINGS_COUNT_FAIL:
			return {
				...state,
				meetingsCountError: action.payload
			};
		default:
			return state;
	}
}
