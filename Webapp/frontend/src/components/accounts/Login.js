import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import login_business from '../../../../media/login_business.jpg';
import '../styles/Account.css';

// See: https://mdbootstrap.com/docs/standard/extended/login/#!
export class Login extends Component {
  // Initialize component state with username & password
  state = {
    username: '',
    password: '',
  };

  // Validation prop types
  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  // Event handler for form submission
  onSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  // Event handler for input field changes
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    // Redirecting to the home page if the user is already authenticated
    if (this.props.isAuthenticated) {
      return <Navigate to="/" />;
    }

    const { username, password } = this.state;

    return (
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-50">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src={login_business}
                className="img-fluid"
                alt="Sample image"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              {/*a function that will be called when the form is submitted */}
              <form onSubmit={this.onSubmit}>
                <div><h1 className='text-center'> Welcome to WorkplaceWise! </h1> <br /></div>
                <div className="form-outline mb-4">
                  {/* onChange is a callback function that gets executed whenever the value of an input element changes*/}
                  <input
                    type="text"
                    className='form-control'
                    name='username'
                    onChange={this.onChange}
                    value={username}
                    placeholder="Username"
                  />

                </div>
                <div className="form-outline mb-3">
                  <input
                    type="password"
                    className='form-control'
                    name='password'
                    onChange={this.onChange}
                    value={password}
                    placeholder="Password"
                  />

                </div>
                <div className="text-center mt-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', backgroundColor: '#D3D3D3', color: '#000000' }}
                  >
                    Login
                  </button>
                  <p className='mt-3'>
                    Don't have an account? <Link to="/register" className="small-link">Register</Link>
                  </p>
                  <p className='mt-3'>
                    Forgot your password? <Link to="/forgot-password" className="small-link">Forgot Password</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

// Connecting the component to the Redux store and mapping state to props
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
// Exporting the connected component with actions
export default connect(mapStateToProps, { login })(Login);
