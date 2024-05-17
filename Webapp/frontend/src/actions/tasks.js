import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK, UPDATE_COMPLETION, FETCH_COMPLETED_TASKS_COUNT_SUCCESS,
    FETCH_COMPLETED_TASKS_COUNT_FAIL, FETCH_UNFINISHED_TASKS_COUNT_SUCCESS, FETCH_UNFINISHED_TASKS_COUNT_FAIL } from './types';

// GET TASKS
export const getTasks = () => (dispatch, getState) => {
	axios
		.get('/api/tasks/', tokenConfig(getState))
		.then((res) => {
			dispatch({
				type: GET_TASKS,
				payload: res.data,
			});
		})
		.catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// ADD TASK
export const addTask = (task) => (dispatch, getState) => {
	axios
		.post('/api/tasks/', task, tokenConfig(getState))
		.then((res) => {
			dispatch(createMessage({ addTask: 'Task Added' }));
			dispatch({
				type: ADD_TASK,
				payload: res.data,
			});
		})
		.catch((err) => {
			console.error("Add Task Error:", err);
			dispatch(returnErrors(err.response.data, err.response.status));
		});
};

// UPDATE TASK
export const updateTask = (taskId, taskData) => (dispatch, getState) => {
	axios
		.put(`/api/tasks/${taskId}/`, taskData, tokenConfig(getState))
		.then((res) => {
			dispatch(createMessage({ updateTask: 'Task Updated' }));
			dispatch({
				type: UPDATE_TASK,
				payload: res.data,
			});
		})
		.catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// DELETE TASK
export const deleteTask = (taskId) => (dispatch, getState) => {
	axios
		.delete(`/api/tasks/${taskId}/`, tokenConfig(getState))
		.then((res) => {
			dispatch(createMessage({ deleteTask: 'Task Deleted' }));
			dispatch({
				type: DELETE_TASK,
				payload: taskId,
			});
		})
		.catch((err) => console.log(err));
};

// UPDATE COMPLETION STATUS
export const updateCompletion = (taskId, completed, project, body) => (dispatch, getState) => {
    axios
      .put(`/api/tasks/${taskId}/`, { completed, project, body }, tokenConfig(getState))
      .then((res) => {
        dispatch(createMessage({ updateCompletion: 'Completion Status Updated' }));
        dispatch({
          type: UPDATE_COMPLETION,
          payload: res.data,
        });
      })
      .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
  };

// GET COMPLETED TASKS
export const fetchCompletedTasksCount = (timeRange) => async (dispatch, getState) => {
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
        const response = await axios.get('/api/tasks/completed_tasks_count/', config);
        dispatch({
            type: FETCH_COMPLETED_TASKS_COUNT_SUCCESS,
            payload: response.data.completed_tasks_count
        });
    } catch (error) {
        dispatch({
            type: FETCH_COMPLETED_TASKS_COUNT_FAIL,
            payload: error.message
        });
    }
};

export const fetchUnfinishedTasksCount = (timeRange) => async (dispatch, getState) => {
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
        const response = await axios.get('/api/tasks/unfinished_tasks_count/', config);
        dispatch({
            type: FETCH_UNFINISHED_TASKS_COUNT_SUCCESS,
            payload: response.data.unfinished_tasks_count
        });
    } catch (error) {
        dispatch({
            type: FETCH_UNFINISHED_TASKS_COUNT_FAIL,
            payload: error.message
        });
    }
};
