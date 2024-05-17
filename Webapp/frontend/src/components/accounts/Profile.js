import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Profile extends Component {
  static propTypes = {
    user: PropTypes.object,
  };

  
  render() {
    const { user } = this.props;

    if (!user) {
      return <div>Loading...</div>;
    }
    return (
      <div className="container mt-5">
        <h2 className="mb-4">Account Details</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Personal Information</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>First Name:</strong> {user.first_name}
                  </li>
                  <li className="list-group-item">
                    <strong>Last Name:</strong> {user.last_name}
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> {user.email}
                  </li>
                  <li className="list-group-item">
                    <strong>Username:</strong> {user.username}
                  </li>
                  <li className="list-group-item">
                    <strong>Phone Number:</strong> {user.phone_number}
                  </li>
                  <li className="list-group-item">
                    <strong>Employee ID:</strong> {user.employee_id}
                  </li>
                  <li className="list-group-item">
                    <strong>Supervisor:</strong> {user.supervisor}
                  </li>
                  <li className="list-group-item">
                    <strong>Job Title:</strong> {user.job_title}
                  </li>
                  <li className="list-group-item">
                    <strong>Department:</strong> {user.department}
                  </li>
                  <li className="list-group-item">
                    <strong>Office Location:</strong> {user.office_location}
                  </li>
                </ul>
              </div>
            </div>
            <div className='mt-4'>
              <Link to="/settings/account">
                Edit Account Details
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Profile Picture</h5>
              </div>
              <img
                src={user.profile_pic ? user.profile_pic : 'placeholder_image_url'}
                alt="Profile Picture"
                className="card-img-top"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Profile);
