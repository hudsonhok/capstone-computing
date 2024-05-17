import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../styles/Tasks.css';
import {
  getTasks,
  deleteTask,
  updateTask,
  updateCompletion,
  addTask,
} from '../../actions/tasks';
import Form from './Form';

class Tasks extends Component {
  // Props validation
  static propTypes = {
    tasks: PropTypes.array.isRequired,
    getTasks: PropTypes.func.isRequired,
    addTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    updateCompletion: PropTypes.func.isRequired,
  };

  // Initialize component state
  state = {
    editingTaskId: null,
    updatedProject: '',
    updatedBody: '',
    searchTerm: '',
    selectedProject: 'All',
  };

  // Lifecycle method: Fetch tasks when the component mounts
  componentDidMount() {
    this.props.getTasks();
  }

  // Event handler for editing a task
  handleEditClick = (taskId) => {
    const { tasks } = this.props;
    const taskToEdit = tasks.find((task) => task.id === taskId);

    // Set state to enable editing for the selected task
    this.setState({
      editingTaskId: taskId,
      updatedProject: taskToEdit.project,
      updatedBody: taskToEdit.body,
    });
  };

  // Event handler for updating a task
  handleUpdateClick = () => {
    const { editingTaskId, updatedProject, updatedBody } = this.state;
  // Call updateTask action with the edited task details
    this.props.updateTask(editingTaskId, { project: updatedProject, body: updatedBody });
  // Reset state after updating task
    this.setState({
      editingTaskId: null,
      updatedProject: '',
      updatedBody: '',
    });
  };

  // Event handler for updating task completion status
  handleUpdateCompletion = (taskId, completed, project, body) => {
    this.props.updateCompletion(taskId, completed, project, body);
  };

  // Event handler for adding a new task
  handleAddTask = (task) => {
    this.props.addTask(task);
  };

  // Event handler for deleting a task
  handleDeleteTask = (taskId, project) => {
    this.props.deleteTask(taskId);

    // If all tasks in the selected project are deleted, switch to 'All'
    if (this.state.selectedProject === project) {
      this.setState({
        selectedProject: 'All',
      });
    }
  };

  // Event handler for changing the selected project filter
  handleProjectChange = (e) => {
    const selectedProject = e.target.value;
    this.setState({
      selectedProject,
    });
  };

  render() {
    const { tasks } = this.props;
    const { editingTaskId, updatedProject, updatedBody, searchTerm, selectedProject } = this.state;

    // Filter tasks based on the selected project
    const filteredTasks = tasks.filter(
      (task) =>
        (selectedProject === 'All' || task.project === selectedProject) &&
        (task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.body.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // JSX for rendering the component UI
    return (
      <Fragment>
        {/* Form component for adding new tasks */}
        <div className="mb-4">
          <Form onAddTask={this.handleAddTask} />
        </div>
        {/* Project filter */}
        <div className="mb-1">
          <label htmlFor="projectFilter" style={{ marginRight: '10px' }}>
            Filter by Project:
          </label>
          <select
            id="projectFilter"
            value={selectedProject}
            onChange={this.handleProjectChange}
            style={{ marginRight: '10px' }}
          >
            <option value="All">All</option>
            {[...new Set(tasks.map((task) => task.project))].map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
         {/* Search input for filtering tasks */}
        <div className="mb-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => this.setState({ searchTerm: e.target.value })}
          />
        </div>

        {/* Table for displaying tasks */}
        <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Completed</th>
              <th>Project</th>
              <th>Task</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through filtered tasks and render each row */}
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => this.handleUpdateCompletion(task.id, !task.completed, task.project, task.body)}
                  />
                </td>
                {/* Editable project field */}
                <td>
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      value={updatedProject}
                      onChange={(e) => this.setState({ updatedProject: e.target.value })}
                    />
                  ) : (
                    task.project
                  )}
                </td>
                {/* Editable task description field */}
                <td className="task-body-cell">
                <div className="task-body-content"> {/* Wrap task body content in a div */}
          {editingTaskId === task.id ? (
            <input
              type="text"
              value={updatedBody}
              onChange={(e) => this.setState({ updatedBody: e.target.value })}
            />
          ) : (
            task.body
          )}
        </div>
                </td>
                {/* Options (Edit, Save, Delete) */}
                <td>
                  {/* Conditional for checking if task is in edit mode. If true: display Save, if false: display Edit/Delete buttons */}
                  {editingTaskId === task.id ? (
                    <button onClick={this.handleUpdateClick} className="btn btn-success btn-sm">
                      Save
                    </button>
                  ) : (
                    <div className="btn-group" role="group">
                      <button
                        onClick={() => this.handleEditClick(task.id)}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => this.handleDeleteTask(task.id, task.project)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Fragment>
    );
  }
}
// Mapping state to props for the component
const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks,
});

// Connecting the Tasks component to the Redux store and mapping action creators
export default connect(mapStateToProps, {
  getTasks,
  updateTask,
  deleteTask,
  updateCompletion,
  addTask,
})(Tasks);
