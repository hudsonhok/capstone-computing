import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';
import { createMessage } from '../../actions/messages';

class Register extends Component {
  state = {
      first_name: '',
      last_name: '',
      email: '',
      employee_id: '',
      username: '',
      password: '',
      password2: '',
      profile_pic: null,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { first_name, last_name, email, employee_id, username, password, password2, profile_pic } = this.state;

    if (password !== password2) {
        this.props.createMessage({ passwordNotMatch: 'Passwords do not match' });
    } else {
        const newUser = {
            first_name,
            last_name,
            email,
            employee_id,
            username,
            password,
            profile_pic,
        };
        this.props.register(newUser);
    }
  };

  onChange = (e) => {
    if (e.target.name === 'profile_pic') {
        const file = e.target.files[0];
        this.setState({ profile_pic: file });
    } else {
        this.setState({ [e.target.name]: e.target.value });
    }
  };


  render() {
    // Redirecting to the home page if the user is already authenticated
    if (this.props.isAuthenticated) {
      return <Navigate to="/" />;
    }
    const { first_name, last_name, email, employee_id, username, password, password2 } = this.state;
    return (
      <div className="form">
        <div className="row">

          <div className="col">
            <div className="card-body" style={{ padding: '20px' }}>
              <h2 className="text-center"> Register </h2>
              <form onSubmit={this.onSubmit}>
                {/* Form fields for user registration */}
                <div className="form-group">
                  <label> First Name </label>
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    onChange={this.onChange}
                    value={first_name}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    onChange={this.onChange}
                    value={last_name}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={this.onChange}
                    value={email}
                  />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="employee_id"
                    onChange={this.onChange}
                    value={employee_id}
                  />
                  <small className="form-text text-muted">
                      (Employee ID should start with 3 uppercase letters denoting the company followed by 3 digits. It is necessary 
                      for two or more users to have the same 3 uppercase letters in order to message eachother. An example of two employee ID's 
                      who could message each other are USC123 and USC101.)
                  </small>
                </div>
                <div className="form-group mt-2 mb-2">
                    <div>
                      <label>Profile Picture</label>
                    </div>
                    
                    <input
                        type="file"
                        className="form-control-file mt-2 mb-2"
                        name="profile_pic"
                        onChange={this.onChange}
                        
                    />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    onChange={this.onChange}
                    value={username}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    onChange={this.onChange}
                    value={password}
                  />
                  <small className="form-text text-muted">
                      (Password should be at least 8 characters long and contain at least one letter, one number, and one special character (e.g. !@#$%^&*))
                  </small>
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password2"
                    onChange={this.onChange}
                    value={password2}
                    accept="image/jpeg, image/png"
                  />
                </div>
                <br />
                {/* Registration button and login link */}
                <div className="form-group">
                  <button type="submit" className="btn btn-primary" style={{backgroundColor: '#61677A'}}>
                    Register
                  </button>
                </div>
                <p className='mt-3'>
                  Already have an account? <Link to="/login" className="small-link">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
// Connecting the component to the Redux store and mapping state to props
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
// Exporting the connected component with the actions register and createMessage
export default connect(mapStateToProps, { register, createMessage })(Register);