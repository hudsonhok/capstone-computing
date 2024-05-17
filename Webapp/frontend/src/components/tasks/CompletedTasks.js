import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCompletedTasksCount } from '../../actions/tasks';

const CompletedTasks = ({ completedTasksCount, fetchCompletedTasksCount }) => {
    useEffect(() => {
        fetchCompletedTasksCount('week');
    }, [fetchCompletedTasksCount]);

    return (
        <div>
            <h2>Completed Tasks Count for the Past Week: {completedTasksCount}</h2>
        </div>
    );
};

CompletedTasks.propTypes = {
    completedTasksCount: PropTypes.number.isRequired,
    fetchCompletedTasksCount: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    completedTasksCount: state.tasks.completedTasksCount // Access completedTasksCount from the state
});

export default connect(mapStateToProps, { fetchCompletedTasksCount })(CompletedTasks);
