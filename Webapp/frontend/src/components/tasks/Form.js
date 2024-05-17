import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addTask } from '../../actions/tasks';

export class Form extends Component {
  // Initial component state
  state = {
    project: '',
    body: '',
    suggestions: [],
  };

  // Prop validation for expected type
  static propTypes = {
    addTask: PropTypes.func.isRequired,
    tasks: PropTypes.array.isRequired, // Array of tasks from Redux state
  };

  // Event handler for input changes
  onChange = (e) => {
    const { name, value } = e.target;

    // If the field is for project name, filter suggestions based on existing project names
    if (name === 'project') {
      const { tasks } = this.props;
      const projectSet = new Set(tasks.map(task => task.project));
      const suggestions = Array.from(projectSet).filter(project =>
        project.toLowerCase().startsWith(value.toLowerCase())
      );

      this.setState({
        [name]: value,
        suggestions,
      });
    } else {
      // For other fields, do not show any suggestions
      this.setState({
        [name]: value,
        suggestions: [],
      });
    }
  };

  // Event handler for input field focus
  onFocus = () => {
    const { tasks } = this.props;

    const projectSet = new Set(tasks.map(task => task.project));
    const suggestions = Array.from(projectSet);

    this.setState({
      suggestions,
    });
  };

  // Event handler for form submission
  onSubmit = (e) => {
    e.preventDefault();
    const { project, body } = this.state;
    // Creating a task object from the form data
    const task = { project, body };
    // Calling the addTask action with the task object
    this.props.addTask(task);
    // Resetting the form state after submission
    this.setState({
      project: '',
      body: '',
      suggestions: [], // Clear suggestions after submission
    });
  };

  render() {
    const { project, body, suggestions } = this.state;
    return (
      <div className="form-group">
        <form onSubmit={this.onSubmit} className="row">
          <div className="col-4">
            {/* Input field for the project name with suggestions */}
            <input
              className="form-control"
              type="text"
              name="project"
              placeholder="Project Name"
              onChange={this.onChange}
              onFocus={this.onFocus}
              value={project}
              list="project-suggestions" // Associate input with the datalist
            />
            {/* Suggestions dropdown */}
            <datalist id="project-suggestions">
              {suggestions.map((item, index) => (
                <option key={index} value={item} />
              ))}
            </datalist>
          </div>
          <div className="col-6">
            {/* Input field for the task description */}
            <input
              className="form-control"
              type="text"
              name="body"
              placeholder="Add a task"
              onChange={this.onChange}
              value={body}
            />
          </div>
          <div className="col-2">
            {/* Submit button to add the task */}
            <button type="submit" className="btn btn-primary" style={{ marginTop: '-2px' }}>
              Add
            </button>
          </div>
        </form>
      </div>
    );
  }
}

// Mapping Redux state to component props
const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks, // Assuming tasks are stored in state.tasks.tasks
});

// Connecting the Form component to the Redux store and mapping the addTask action
export default connect(mapStateToProps, { addTask })(Form);
