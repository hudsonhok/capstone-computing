// Import action type constants
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
	FETCH_USERNAMES_SUCCESS,
	FETCH_USERNAMES_FAIL,
	PASSWORD_RESET_EMAIL_SENT,
	PASSWORD_RESET_EMAIL_FAIL,
	SET_NEW_PASSWORD_SUCCESS,
	SET_NEW_PASSWORD_FAIL
  } from "../actions/types";
  
  // Initial state for the authentication reducer
  const initialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: null,
	isLoading: false,
	user: null,
	usernames: [], 
	usernamesError: null, 
	emailSent: false,
	emailError: null,
	newPasswordSuccess: false,
	newPasswordError: null
  };
  
  // Authentication reducer function
  export default function(state = initialState, action) {
	switch (action.type) {
	  case USER_LOADING:
		return { ...state, isLoading: true };
	  case USER_LOADED:
		return {
		  ...state,
		  isAuthenticated: true,
		  isLoading: false,
		  user: action.payload
		};
	  case LOGIN_SUCCESS:
	  case REGISTER_SUCCESS:
		localStorage.setItem('token', action.payload.token);
		return {
		  ...state,
		  ...action.payload,
		  isAuthenticated: true,
		  isLoading: false,
		};
	  case AUTH_ERROR:
	  case LOGIN_FAIL:
	  case LOGOUT_SUCCESS:
	  case REGISTER_FAIL:
			localStorage.removeItem('token'); // Remove token from local storage
			return {
				...state,
				token: null,
				user: null,
				isAuthenticated: false,
				isLoading: false
			};
	  case UPDATE_USER_SUCCESS:
			return {
				...state,
				user: action.payload,
			};
	  case UPDATE_USER_FAIL:
			return {
				...state,
			};
	  case FETCH_USERNAMES_SUCCESS:
			return {
				...state,
				usernames: action.payload,
				usernamesError: null,
			};
	  case FETCH_USERNAMES_FAIL:
			return {
				...state,
				usernamesError: action.payload,
			};
		case PASSWORD_RESET_EMAIL_SENT:
			return {
				...state,
				emailSent: true,
				emailError: null
			};
		case PASSWORD_RESET_EMAIL_FAIL:
			return {
				...state,
				emailSent: false,
				emailError: action.error
			};
		case SET_NEW_PASSWORD_SUCCESS:
			return {
				...state,
				newPasswordSuccess: true,
				newPasswordError: null
			};
		case SET_NEW_PASSWORD_FAIL:
			return {
				...state,
				newPasswordSuccess: false,
				newPasswordError: action.error
			};
	  default:
		return state;
	}
  }
  