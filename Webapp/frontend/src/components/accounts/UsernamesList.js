import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchUsernames } from '../../actions/auth';

const UsernamesList = ({ isAuthenticated, usernames, fetchUsernames, usernamesError }) => {
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsernames();
    }
  }, [fetchUsernames, isAuthenticated]);

  return (
    <div>
      <h2>Usernames List</h2>
      {usernamesError && <p>Error: {usernamesError}</p>}
      <ul>
        {usernames.map((username, index) => (
          <li key={index}>{username}</li>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  usernames: state.auth.usernames,
  usernamesError: state.auth.usernamesError
});

export default connect(mapStateToProps, { fetchUsernames })(UsernamesList);
