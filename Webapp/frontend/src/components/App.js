import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route,Routes, Navigate } from 'react-router-dom';

// Alerts
import Alerts from './layout/Alerts';
import { Provider as AlertProvider, transitions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { positions } from 'react-alert'

// Authentication
import Login from './accounts/Login';
import Register from './accounts/Register';
import PrivateRoute from './common/PrivateRoute';
import { Provider } from 'react-redux';
import { loadUser } from '../actions/auth';
import store from "../store";

// Settings
import Settings from './settings/Settings';
import AboutUs from './settings/AboutUs';
import NotificationSettings from './settings/NotificationSettings';
import PrivacyPolicy from './settings/PrivacyPolicy';
import AccountSettings from './settings/AccountSettings';
import HelpAndSupport from './settings/HelpAndSupport';

// General
import Navbar from './layout/Navbar';
import Profile from './accounts/Profile';
import TasksApp from './tasks/TasksApp';
import Dashboard from './home/Dashboard';
import Calendar from './calendar/Calendar';
import Discussions from './discussions/Discussions';
import Messages from './discussions/Messages';
import Performance from './performance/Performance';
import Home from './home/Home';
import About from './home/About';

// Performance
import Tasks from './performance/Tasks';
import Attendance from './performance/Attendance';

import ForgotPassword from './accounts/ForgotPassword';
import ResetPassword from './accounts/ResetPassword';

import CompletedTasks from './tasks/CompletedTasks';

// Alert options
const alertOptions = {
    timeout: 5000,
    position: positions.TOP_CENTER,
};

class App extends Component{
    // Makes it so that refreshing the page doesn't log user out
    componentDidMount(){
        store.dispatch(loadUser());
    };

    render(){
        return(
            <Provider store={store}>
                <AlertProvider template = {AlertTemplate}{...alertOptions}>
                    <Router>
                        <Fragment>
                            <Navbar/>
                            <Alerts/>
                                <Routes>
                                    <Route exact path ="/" element= {<PrivateRoute> <Dashboard/> </PrivateRoute> }/>
                                    <Route exact path ="/profile" element= {<Profile/>}/>
                                    <Route exact path ="/register" element={<Register/>}/>
                                    <Route exact path ="/login" element={<Login/>}/>
                                    <Route exact path ="/home" element={<Home/>}/>
                                    <Route exact path ="/about" element={<About/>}/>
                                    <Route exact path ="/tasks" element= {<TasksApp/>}/>
                                    <Route exact path ="/tasks/completed" element= {<PrivateRoute><CompletedTasks/></PrivateRoute>}/>
                                    <Route exact path ="/settings" element= {<Settings/>}/>
                                    <Route exact path ="/settings/about" element= {<AboutUs/>}/>
                                    <Route exact path ="/settings/notifications" element= {<NotificationSettings/>}/>
                                    <Route exact path ="/settings/privacy" element= {<PrivacyPolicy/>}/>
                                    <Route exact path ="/settings/help" element= {<HelpAndSupport/>}/>
                                    <Route exact path ="/settings/account" element= {<AccountSettings/>}/>
                                    <Route exact path ="/forgot-password" element= {<ForgotPassword/>}/>
                                    <Route exact path ="/reset-password" element= {<ResetPassword/>}/>
                                    <Route exact path ="/calendar" element= {<Calendar/>}/>
                                    <Route exact path ="/discussions" element= {<Discussions/>}/>
                                    <Route exact path ={`/messages/:discussionId`} element= {<Messages/>}/>
                                    <Route exact path ="/performance" element= {<Performance/>}/>
                                    <Route exact path ="/performance/tasks" element= {<Tasks/>}/>
                                    <Route exact path ="/performance/attendance" element= {<Attendance/>}/>
                                </Routes>
                        </Fragment>
                    </Router>
                </AlertProvider>
            </Provider>
        )
    }
}

ReactDOM.createRoot(
    document.getElementById("app"),
    )
    .render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );

document.body.style.backgroundColor = '#FFF6E0';