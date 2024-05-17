import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Settings = ({ user }) => {
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container'>
            <h1 style={{ textAlign: 'center' }} className="mb-4"> General </h1>
            <div style={{textAlign:'center'}}>
                {/* Toggles for various setting groups */}
                <Link to="/settings/account">Account Settings</Link>
                <Link to="/settings/notifications">Notification Settings</Link>
                <Link to="/settings/privacy">Privacy</Link>
                <Link to="/settings/help">Help & Support</Link>
                <Link to="/settings/about">About Us</Link>
            </div>
        </div>
    );
};

Settings.propTypes = {
    user: PropTypes.object,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(Settings);
