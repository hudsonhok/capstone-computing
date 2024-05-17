import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateUser } from '../../actions/auth';
import '../styles/Settings.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const AccountSettings = ({ updateUser, user }) => {
    const [formData, setFormData] = useState({
        first_name: user ? user.first_name || '' : '',
        last_name: user ? user.last_name || '' : '',
        email: user ? user.email || '' : '',
        employee_id: user ? user.employee_id || '' : '',
        username: user ? user.username || '' : '',
        password: '',
        job_title: user ? user.job_title || '' : '',
        office_location: user ? user.office_location || '' : '',
        department: user ? user.department || '' : '',
        phone_number: user ? user.phone_number || '' : '',
        supervisor: user ? user.supervisor || '' : '',
        profile_pic: null,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                ...formData,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                employee_id: user.employee_id || '',
                username: user.username || '',
                job_title: user.job_title || '',
                office_location: user.office_location || '',
                department: user.department || '',
                phone_number: user.phone_number || '',
                supervisor: user.supervisor || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(formData);
        setFormData({
            ...formData,
            password: '',
            profile_pic: null,
        });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Account Settings</h2>
            <form onSubmit={handleSubmit} className="centered-container">
                <div>
                    <label htmlFor="first_name">First Name:</label>
                    <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name:</label>
                    <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="employee_id">Employee ID:</label>
                    <input type="text" id="employee_id" name="employee_id" value={formData.employee_id} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="job_title">Job Title:</label>
                    <input type="text" id="job_title" name="job_title" value={formData.job_title} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="office_location">Office Location:</label>
                    <input type="text" id="office_location" name="office_location" value={formData.office_location} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="department">Department:</label>
                    <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="phone_number">Phone Number:</label>
                    <input type="text" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="supervisor">Supervisor:</label>
                    <input type="text" id="supervisor" name="supervisor" value={formData.supervisor} onChange={handleChange} />
                </div>
                <div className="profile-pic-container"> 
                    <label htmlFor="profile_pic">Profile Picture:</label>
                    <input type="file" id="profile_pic" name="profile_pic" onChange={handleChange} />
                </div>
                <div className="button-container">
                    <button type="submit">Save</button>
                    <Link to="/profile">Back to Profile</Link>
                    <Link to="/settings">Back to General</Link>
                </div>
            </form>
            
        </div>
    );
};

AccountSettings.propTypes = {
    updateUser: PropTypes.func.isRequired,
    user: PropTypes.object,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps, { updateUser })(AccountSettings);
