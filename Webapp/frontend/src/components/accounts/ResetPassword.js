import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setNewPassword } from '../../actions/auth';
import { Link } from 'react-router-dom';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      error: null,
      success: false,
      uidb64: '',
      token: ''
    };
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(window.location.search);
    const uidb64 = searchParams.get('uidb64');
    const token = searchParams.get('token');
    
    this.setState({ uidb64, token });
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { password, confirmPassword, uidb64, token } = this.state;
    console.log('Data sent to backend API:', { password, confirmPassword, uidb64, token });

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      return;
    }
    this.props.setNewPassword({ password, token, uidb64 });
    this.setState({ success: true });
  };

  render() {
    const { password, confirmPassword, error, success } = this.state;

    return (
      <div>
        <h2>Reset Password</h2>
        {success ? (
          <div style={{margin: '10px', justifyContent: 'center', display: 'flex', alightItems: 'center'}}>
            <p>Password reset successfully!</p>
            <div style={{margin: '10px', justifyContent: 'center', display: 'flex', alightItems: 'center'}}>
                <p className='mt-3'> <Link to="/login" className="small-link">Back to Login</Link> </p>
            </div>
            
          </div>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <div style={{margin: '10px', justifyContent: 'center', display: 'flex', alightItems: 'center'}}>
              <label>New Password:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div style={{margin: '10px', justifyContent: 'center', display: 'flex', alightItems: 'center'}}>
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div style={{margin: '10px', justifyContent: 'center', display: 'flex', alightItems: 'center'}}>
                <button type="submit">Reset Password</button>
            </div>
            
          </form>
        )}
        {error && <p>{error}</p>}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setNewPassword
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(ResetPassword);
