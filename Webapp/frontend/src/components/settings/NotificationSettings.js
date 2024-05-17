import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateUser } from '../../actions/auth';

import '../styles/Settings.css';

const NotificationSettings = ({ auth, updateUser }) => {
    // Initialize local state with user's notification settings from Redux
    const [loading, setLoading] = useState(true); // State to track loading status
    const [allowNotifications, setAllowNotifications] = useState(false);
    const [notifyThrough, setNotifyThrough] = useState('');
    const [meetingRequests, setMeetingRequests] = useState(false);
    const [messages, setMessages] = useState(false);
    const [taskDeadlines, setTaskDeadlines] = useState(false);

    // Function to toggle the state of a notification setting
    const toggleSetting = (setter) => {
        setter((prev) => !prev);
    };

    // Function to handle changes in 'Allow Notifications' setting
    const handleAllowNotificationsChange = () => {
        const updatedValue = !allowNotifications; // Toggle the value
        setAllowNotifications(updatedValue); // Update local state immediately
        updateUser({ allowNotifications: updatedValue }); // Update backend and Redux state
    };

    // Function to handle changes in 'Notify through' setting
    const handleNotifyThroughChange = (event) => {
        const newValue = event.target.value;
        setNotifyThrough(newValue); // Update local state immediately
        updateUser({ notifyThrough: newValue }); // Update backend and Redux state
    };

    // Function to handle changes in 'Meeting Requests' setting
    const handleMeetingRequestsChange = () => {
        toggleSetting(setMeetingRequests);
        updateUser({ notifyforEvents: !meetingRequests });
    };

    // Function to handle changes in 'Messages' setting
    const handleMessagesChange = () => {
        toggleSetting(setMessages);
        updateUser({ notifyforMessages: !messages });
    };

    // Function to handle changes in 'Task Deadlines' setting
    const handleTaskDeadlinesChange = () => {
        toggleSetting(setTaskDeadlines);
        updateUser({ notifyforTasks: !taskDeadlines });
    };

    useEffect(() => {
        if (auth.user) {
            // Update local state with new user data from Redux when it changes
            setAllowNotifications(auth.user.allowNotifications);
            setNotifyThrough(auth.user.notifyThrough);
            setMeetingRequests(auth.user.notifyforEvents);
            setMessages(auth.user.notifyforMessages);
            setTaskDeadlines(auth.user.notifyforTasks);
            setLoading(false); // Set loading to false once user data is available
        }
    }, [auth.user]); // Trigger useEffect whenever auth.user changes

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container p-4 rounded">
            <h2 className="mb-4">Notification Settings</h2>
            <div className="option-card mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="option-title">Allow Notifications</h5>
                    <Switch
                        onChange={handleAllowNotificationsChange}
                        checked={allowNotifications}
                    />
                </div>
            </div>
            <div className="option-card mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="option-title">Notify me through</h5>
                    <select
                        value={notifyThrough}
                        onChange={handleNotifyThroughChange}
                        className="col-2"
                    >
                        <option value="Messages">Messages</option>
                        <option value="Email">Email</option>
                       {/* <option value="SMS">SMS</option> */}
                    </select>
                </div>
            </div>

            <h2 className="mb-4">Allow Notifications for</h2>

            <div className="option-card mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="option-title">Meeting Requests</h5>
                    <Switch
                        onChange={handleMeetingRequestsChange}
                        checked={meetingRequests}
                    />
                </div>
            </div>

            <div className="option-card mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="option-title">Messages</h5>
                    <Switch onChange={handleMessagesChange} checked={messages} />
                </div>
            </div>

            {/*
            <div className="option-card mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="option-title">Task Deadlines</h5>
                    <Switch
                        onChange={handleTaskDeadlinesChange}
                        checked={taskDeadlines}
                    />
                </div>
            </div>
            */}

            <div className='container' style={{textAlign:'center'}}>
                <Link to="/settings">Back</Link>
            </div>
        </div>
    );
};

NotificationSettings.propTypes = {
    auth: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { updateUser })(NotificationSettings);
