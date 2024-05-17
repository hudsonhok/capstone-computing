import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_DISCUSSIONS, ADD_DISCUSSION, GET_MESSAGES, ADD_MESSAGE, UPDATE_DISCUSSION } from './types';

export const getDiscussions = () => (dispatch, getState) => {
    axios
        .get('/api/discussions/', tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_DISCUSSIONS,
                payload: res.data,
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const updateDiscussion = (updatedDiscussion) => (dispatch, getState) => {
    axios
        .put(`/api/discussions/${updatedDiscussion.id}/`, updatedDiscussion, tokenConfig(getState))
        .catch((err) => {
            console.error('Update Discussion Error:', err);
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

export const addDiscussion = (discussion) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        axios
            .post('/api/discussions/', discussion, tokenConfig(getState))
            .then((res) => {
                dispatch(createMessage({ addDiscussion: 'Discussion Added' }));
                dispatch({
                    type: ADD_DISCUSSION,
                    payload: res.data,
                });
                resolve(res.data);
            })
            .catch((err) => {
                console.error('Add Discussion Error:', err);
                dispatch(returnErrors(err.response.data, err.response.status));
                reject(err);
            });
    });
};

export const getMessages = (discussionId) => (dispatch, getState) => {
    axios
        .get(`/api/messages/?discussion=${discussionId}/`, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_MESSAGES,
                payload: { discussionId, messages: res.data },
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const addMessage = (message) => (dispatch, getState) => {
    axios
        .post('/api/messages/', message, tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addMessage: 'Message Added' }));
            dispatch({
                type: ADD_MESSAGE,
                payload: res.data,
            });
        })
        .catch((err) => {
            console.error('Add Message Error:', err);
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};