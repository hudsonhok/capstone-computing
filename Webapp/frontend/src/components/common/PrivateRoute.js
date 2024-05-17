import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

// https://stackoverflow.com/questions/69923420/how-to-use-private-route-in-react-router-domv6

// The component checks if the user is authenticated
  // If authenticated, it renders the children components (the content inside the PrivateRoute component)
  // If not authenticated, it redirects the user to the login page using the Navigate component
  // The 'replace' prop is used to replace the current entry in the navigation history, preventing the user from going back to the protected route after logging in
const PrivateRoute = ({ auth: { isAuthenticated }, children }) => {
  return isAuthenticated ? children : <Navigate to="/home" replace />;
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);