import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Define the Alerts component
export class Alerts extends Component {
  // Define propTypes for error and message objects
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  // Lifecycle method called when component updates
  componentDidUpdate(prevProps) {
    // Destructure props for easy access
    const { error, alert, message } = this.props;
    // Handle changes in the error object
    if (error !== prevProps.error) { // if this.props.error changed
      if (error.msg.username) alert.error(`Username: ${error.msg.username.join()}`);
      if (error.msg.email) alert.error(`Email: ${error.msg.email.join()}`);
      if (error.msg.employee_id) alert.error(`Employee ID: ${error.msg.employee_id.join()}`);
      if (error.msg.profile_pic) alert.error(`Profile Picture: ${error.msg.profile_pic.join()}`);
      if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
      if (error.msg.password) alert.error(`Password: ${error.msg.password.join()}`);
      if (error.msg.password2) alert.error(`Confirm Password: ${error.msg.password2.join()}`);
      if (error.msg.body) alert.error(`Task: ${error.msg.body.join()}`);
      if (error.msg.project) alert.error(`Project: ${error.msg.project.join()}`);


    }

    if (message !== prevProps.message) {
      if (message.passwordNotMatch) alert.error(message.passwordNotMatch);
    }
  }

  render() {
    return <Fragment />;
  }
}

// Map state to props for connecting to Redux store
const mapStateToProps = (state) => ({
  error: state.errors,
  message: state.messages,
});

export default connect(mapStateToProps)(withAlert()(Alerts));
