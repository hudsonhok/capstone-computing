// Import Axios for making HTTP requests
import axios from 'axios';

// Import action creators for handling messages and errors
import { createMessage, returnErrors, fetchUsernamesSuccess, fetchUsernamesFail } from "./messages";

// Import action types
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    PASSWORD_RESET_EMAIL_SENT,
    PASSWORD_RESET_EMAIL_FAIL,
    SET_NEW_PASSWORD_SUCCESS,
    SET_NEW_PASSWORD_FAIL,
    EMAIL_NOTIFICATION_SENT,
    EMAIL_NOTIFICATION_FAIL
} from './types';

// Helper function to configure the request headers with the authentication token
export const tokenConfig = (getState, isMultipart = false) => {
    // Get the token from the application state (Redux store)
    const token = getState().auth.token;
    // Default headers configuration
    const config = {
        headers: {
            'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
        },
    };
    // If a token exists, add it to the headers
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
};

// Action to check token and load user information
export const loadUser = () => (dispatch, getState) => {
    // Dispatch an action indicating that user loading is in progress
    dispatch({ type: USER_LOADING });

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
        // If token exists, send a request to load user information
        axios.get('/api/user-info/', tokenConfig(getState))
            .then(res => {
                // If successful, dispatch USER_LOADED action with user data
                dispatch({
                    type: USER_LOADED,
                    payload: res.data
                });
            })
            .catch(err => {
                // If there's an error, dispatch error details and AUTH_ERROR action
                dispatch(returnErrors(err.response.data, err.response.status));
                dispatch({
                    type: AUTH_ERROR
                })
            });
    } else {
        // If token doesn't exist, dispatch AUTH_ERROR action
        dispatch({
            type: AUTH_ERROR
        });
    }
}

// Action to log in a user
export const login = (username, password) => dispatch => {
    // Headers configuration for the request
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    // Request body with user credentials
    const body = JSON.stringify({ username, password });

    // Send a POST request to the login API
    axios.post('/api/login/', body, config)
        .then((res) => {
            // If successful, dispatch LOGIN_SUCCESS action with token and user data
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        })
        .catch((err) => {
            // If there's an error, log it, dispatch error details, and LOGIN_FAIL action
            console.log(err);
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL,
            })
        });
}

// Action to log out a user
export const logout = () => (dispatch, getState) => {
    // Send a POST request to the logout API with null as the body
    axios.post('/api/logout/', null, tokenConfig(getState))
        .then((res) => {
            // If successful, dispatch LOGOUT_SUCCESS action
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        })
        .catch(err => {
            // If there's an error, dispatch error details
            dispatch(returnErrors(err.response.data, err.response.status));
        });
}

// Action to register a new user
export const register = ({ first_name, last_name, email, employee_id, username, password, profile_pic }) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email);
    formData.append('employee_id', employee_id);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('profile_pic', profile_pic);

    axios.post('/api/register/', formData, config)
        .then((res) => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
            dispatch(createMessage({ registerUser: 'User registered successfully.' }))
        })
        .catch((err) => {
            console.log(err);
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL,
            })
        });
}

// Action to update user information
export const updateUser = (userData) => (dispatch, getState) => {
    const { profile_pic, ...otherFields } = userData;

    const formData = new FormData();

    // Append other fields to the formData
    for (const key in otherFields) {
        if (otherFields.hasOwnProperty(key)) {
            formData.append(key, otherFields[key]);
        }
    }

    // Append profile_pic as a file to formData
    if (profile_pic instanceof File) {
        formData.append('profile_pic', profile_pic, profile_pic.name);
    }
    console.log(formData);
    axios
        .patch('/api/update-user/', formData, tokenConfig(getState, true))
        .then((res) => {
            // console.log(res.data);
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: UPDATE_USER_FAIL,
            });
        });
};

export const fetchUsernames = () => {
    return (dispatch, getState) => {
      const { token } = getState().auth;
      axios.get('/api/all-usernames', {
        headers: {
          'Authorization': `Token ${token}`,
        }
      })
      .then(response => {
        const usernames = response.data.usernames;
        dispatch(fetchUsernamesSuccess(usernames));
      })
      .catch(error => {
        dispatch(fetchUsernamesFail(error.message));
      });
    };
  };

export const sendEventEmailNotification = ({ participant_email, title, sender }) => {
    return (dispatch) => {
        axios.post('api/event-email-notification', { participant_email, title, sender })
        .then((response) => {
            dispatch({
            type: EMAIL_NOTIFICATION_SENT
            });
        })
        .catch((error) => {
            dispatch({
            type: EMAIL_NOTIFICATION_FAIL,
            error
            });
        });
    };
};

export const sendMessageEmailNotification = ({ participant_email, title, number_of_discussionUsers }) => {
    return (dispatch) => {
        axios.post('api/message-email-notification', { participant_email, title, number_of_discussionUsers })
        .then((response) => {
            dispatch({
            type: EMAIL_NOTIFICATION_SENT
            });
        })
        .catch((error) => {
            dispatch({
            type: EMAIL_NOTIFICATION_FAIL,
            error
            });
        });
    };
};

export const sendPasswordResetEmail = ({ email, redirect_url }) => {
    return (dispatch) => {
        axios.post('/api/request-reset-email/', { email, redirect_url })
        .then((response) => {
            dispatch({
            type: PASSWORD_RESET_EMAIL_SENT
            });
        })
        .catch((error) => {
            dispatch({
            type: PASSWORD_RESET_EMAIL_FAIL,
            error
            });
        });
    };
};
  
  export const setNewPassword = ({ password, token, uidb64 }) => {
    return (dispatch) => {
      axios.patch('/api/password-reset-complete/', { password, token, uidb64 })
        .then((response) => {
          dispatch({
            type: SET_NEW_PASSWORD_SUCCESS
          });
        })
        .catch((error) => {
          dispatch({
            type: SET_NEW_PASSWORD_FAIL, 
            error
        });
        });
    };
  };