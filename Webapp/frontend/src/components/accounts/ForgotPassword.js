import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sendPasswordResetEmail } from '../../actions/auth';
import { Link, Navigate } from 'react-router-dom';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      redirectUrl: 'https://workplace-wise-27kxy.ondigitalocean.app/#/reset-password',
      emailSent: false
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, redirectUrl } = this.state;
    this.props.sendPasswordResetEmail({ email, redirect_url: redirectUrl });
    this.setState({ emailSent: true });
  };

  render() {
    const { email, emailSent } = this.state;
    const { error } = this.props;

    return (
      <div style={{ marginTop: '10px' }}>
        <h2>Forgot Password?</h2>
        <form onSubmit={this.handleSubmit}>
          <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: '20px'}}> 
            <label style={{ marginRight: '10px' }}>Email: </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              required
              style={{ width: '300px' }}
            />
          
          <button type="submit">Send</button>
          </div>
          <p className='mt-3' style={{ justifyContent: 'center', alignItems: 'center', display: 'flex'}}> Know your login? 
            <Link to="/login" className="small-link">Back to Login</Link> </p>
        </form>
        {emailSent && <p style={{justifyContent: 'center', display: 'flex', alightItems: 'center'}}>An email has been sent to {email} with instructions to reset your password.</p>}
        {error && <p>{error}</p>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.auth.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      sendPasswordResetEmail
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
