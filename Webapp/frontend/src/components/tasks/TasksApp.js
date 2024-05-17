import React, { Fragment, Component } from 'react';
import Tasks from './Tasks';
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class TasksApp extends Component {
  // Prop validation
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="pt-3">
        <h1 style={{ textAlign: 'center' }} className='mb-4'>
          Tasks
        </h1>
        <Fragment>
          <div className="px-5">
            <Tasks />
          </div>
        </Fragment>
      </div>
    );
  }
}
// Mapping state to props for the component
const mapStateToProps = (state) => ({
  // we have a prop called auth
  auth: state.auth,
});
// Connecting the TasksApp component to the Redux store
export default connect(mapStateToProps)(TasksApp);
