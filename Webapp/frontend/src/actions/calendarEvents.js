import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_EVENTS, ADD_EVENT, DELETE_EVENT, UPDATE_EVENT, ADD_EVENT_TO_ALL,FETCH_ATTENDED_MEETINGS_COUNT_FAIL, FETCH_ATTENDED_MEETINGS_COUNT_SUCCESS,
FETCH_UNATTENDED_MEETINGS_COUNT_FAIL, FETCH_UNATTENDED_MEETINGS_COUNT_SUCCESS, UPDATE_ATTENDANCE } from './types';

export const getEvents = () => (dispatch, getState) => {
	axios
		.get('/api/event/', tokenConfig(getState))
		.then((res) => {
			dispatch({
				type: GET_EVENTS,
				payload: res.data,
			});
		})
		.catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const addEvent = (event) => (dispatch, getState) => {
	axios
		.post('/api/event/', event, tokenConfig(getState))
		.then((res) => {
			dispatch(createMessage({ addEvent: 'Event Added' }));
			dispatch({
				type: ADD_EVENT,
				payload: res.data,
			});
		})
		.catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const addEventToAll = (event) => (dispatch, getState) => {
	axios
		.post('/api/all-events/', event, tokenConfig(getState))
		.then((res) => {
			dispatch(createMessage({ addEvent: 'Event Added' }));
			dispatch({
				type: ADD_EVENT_TO_ALL,
				payload: res.data,
			});
		})
		.catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const deleteEvent = (eventId) => (dispatch, getState) => {
	axios
		.delete(`/api/event/${eventId}/`, tokenConfig(getState))
		.then((res) => {
			dispatch(createMessage({ deleteEvent: 'Event Canceled' }));
			dispatch({
				type: DELETE_EVENT,
				payload: eventID,
			});
		})
		.catch((err) => console.log(err));
};

export const updateEvent = (eventId, eventInfo) => (dispatch, getState) => {
	axios
		.put(`/api/event/${eventId}/`, eventInfo, tokenConfig(getState))
		.then((res) => {
			dispatch(createMessage({ updateEvent: 'Event Status Updated' }));
			dispatch({
				type: UPDATE_EVENT,
				payload: res.data,
			});
		})
		.catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// UPDATE ATTENDED STATUS
export const updateAttendance = (eventId, attended) => (dispatch, getState) => {
	axios
	  .put(`/api/event/${eventId}/`, { attended }, tokenConfig(getState))
	  .then((res) => {
		dispatch(createMessage({ updateAttendance: 'Attendance Status Updated' }));
		dispatch({
		  type: UPDATE_ATTENDANCE,
		  payload: res.data,
		});
	  })
	  .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
  };

// GET ATTENDED MEETINGS
export const fetchAttendedMeetingsCount = (timeRange) => async (dispatch, getState) => {
    try {
        const { token } = getState().auth; // Get the authentication token from the Redux store
        const config = {
            headers: {
                Authorization: `Token ${token}`
            },
            params: {
                time_range: timeRange
            }
        };
		const response = await axios.get('/api/event/attended_meetings_count/', config);
        dispatch({
            type: FETCH_ATTENDED_MEETINGS_COUNT_SUCCESS,
            payload: response.data.attended_meetings_count
        });
    } catch (error) {
        dispatch({
            type: FETCH_ATTENDED_MEETINGS_COUNT_FAIL,
            payload: error.message
        });
    }
};

// GET UNATTENDED MEETINGS
export const fetchUnattendedMeetingsCount = (timeRange) => async (dispatch, getState) => {
    try {
        const { token } = getState().auth;
        const config = {
            headers: {
                Authorization: `Token ${token}`
            },
            params: {
                time_range: timeRange
            }
        };
        const response = await axios.get('/api/event/unattended_meetings_count/', config);
        dispatch({
			type: FETCH_UNATTENDED_MEETINGS_COUNT_SUCCESS,
            payload: response.data.unattended_meetings_count
        });
    } catch (error) {
        dispatch({
            type: FETCH_UNATTENDED_MEETINGS_COUNT_FAIL,
            payload: error.message
        });
    }
};
