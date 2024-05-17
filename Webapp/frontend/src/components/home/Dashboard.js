import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import '../styles/Settings.css';
import UsernamesList from "../accounts/UsernamesList";

class Dashboard extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div className="container pt-5 pl-3 pr-3">
        <h1 className="mb-4" style={{ fontSize: "2rem" }}>
          Welcome back <strong>{user.username}</strong>.
        </h1>
        {/* <div>
          <UsernamesList />
        </div> */}

        <div className="dashboard-info">
					<p className="mb-4" style={{ fontSize: "1.2rem" }}>
						Ready to start a new day?
					</p>

          <p className="mb-4" style={{ fontSize: "1.2rem" }}>
            Send a message to your coworker to update them about anything new.
          </p>

          <p className="mb-4" style={{ fontSize: "1.2rem" }}>
            Have you seen your Tasks? Make sure to manage your to-dos, set priorities, and
            track your progress. Boost your productivity and accomplish more!
          </p>

          <p className="mb-4" style={{ fontSize: "1.2rem" }}>
            Got some events to schedule or check up on? Straight to the calendar you go!
          </p>

          <p style={{ fontSize: "1.2rem" }}>
            Curious about your performance? See how you're doing in the Performance tab!
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
