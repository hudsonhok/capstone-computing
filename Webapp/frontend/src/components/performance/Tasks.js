import React, { Component } from "react";
import { connect } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { fetchCompletedTasksCount, fetchUnfinishedTasksCount } from '../../actions/tasks';

class Tasks extends Component {
  state = {
    loading: true,
    completedTasksCount: null,
    unfinishedTasksCount: null,
    completionPercentage: null,
    timeRange: 'all_time',
    chartKey: Date.now(),
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the time range has changed
    if (prevState.timeRange !== this.state.timeRange) {
      //console.log("Time range changed. Fetching data...");
      this.fetchData();
    }
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const { timeRange } = this.state;
      await this.props.fetchCompletedTasksCount(timeRange);
      await this.props.fetchUnfinishedTasksCount(timeRange);
      // Calculate completion percentage
      const { completedTasksCount, unfinishedTasksCount } = this.props;
      const totalTasksCount = completedTasksCount + unfinishedTasksCount;
      const completionPercentage = totalTasksCount === 0 ? 0 : (completedTasksCount / totalTasksCount) * 100;

      this.setState({ loading: false, completedTasksCount, unfinishedTasksCount, completionPercentage, chartKey: Date.now() });
    } catch (error) {
      console.error("Error fetching tasks data:", error);
      this.setState({ loading: false });
    }
  };

  handleTimeRangeChange = (event) => {
    const timeRange = event.target.value;
    this.setState({ timeRange }, () => {
      this.fetchData();
    });
  };

  
  render() {
// const { userLoginData, attendanceData, tasksCompletedData } = this.state;

//   const {testData} = this.state;
    const { loading, completionPercentage, completedTasksCount, unfinishedTasksCount, timeRange, chartKey } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }
    // Data for Task Pie Chart
    const taskSummary = [
      { task: "Tasks Completed", value: completedTasksCount || 0 },
      { task: "Tasks Not Completed", value: unfinishedTasksCount || 0 },
    ];

    const COLORS = ['#0088FE', '#FF8042'];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };
    if (completedTasksCount + unfinishedTasksCount == 0 && timeRange == "all_time") {
      return (
        <div>
        <h1 style={{ textAlign: 'center' }} className='mb-4'>Attendance Statistics</h1>
        <h2 style={{ textAlign: 'center' }} className='mb-4'>You have not added any tasks</h2>

        <br/>
        <br/>
        {/* Back Button */}
            <div style={{textAlign:'center'}}>
                <Link to="/performance">Back</Link>
            </div>
      </div>
      );
    } else {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }} className='mb-4'>Tasks Statistics</h1>
	{/* TODO: */}
                  {/* The user should be able to view: */}
                  {/* overall percentage of tasks completed */}
                  {/* completed tasks */}
                  {/* uncompleted tasks */}
                  {/* tasks completed on time */}
                  {/* tasks completed late */}
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="timeRange">Select Time Range: </label>
          <select id="timeRange" value={timeRange} onChange={this.handleTimeRangeChange}>
            <option value="all_time"> All time </option>
            <option value="month"> Monthly </option>
            <option value="week"> Weekly </option>
            <option value="day"> Daily </option>
            <option value="last_5_minutes"> Last 5 Minutes </option>
          </select>
        </div>
        <h2 style={{ textAlign: 'center' }} className='mb-4'>Task Completion: {completionPercentage !== null ? completionPercentage.toFixed(2) + '%' : 'Loading...'}</h2>
        <ResponsiveContainer key={chartKey} width='99%' height={400}>
          <PieChart width={1350} height={340}>
            <Pie
              data={taskSummary}
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {taskSummary.map((entry, index) => (
                <Cell style={{ outline: 'none' }} key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              payload={
                taskSummary.map(
                  (item, index) => ({
                    id: item.task,
                    type: "circle",
                    value: `${item.task}`,
                    color: COLORS[index % COLORS.length]
                  })
                )
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <br />
        <br />
        {/* Displaying task counts */}
        <div style={{ textAlign: 'center' }}>
          <p><b>Completed Tasks: </b>{completedTasksCount}</p>
          <p><b>Uncompleted Tasks: </b>{unfinishedTasksCount}</p>
          {/* Due data not implemented yet */}
        </div>
        <br/>
        {/* Back button */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/performance">Back</Link>
        </div>
      </div>
    );
            }
  }
}

const mapStateToProps = state => ({
  completedTasksCount: state.tasks.completedTasksCount,
  unfinishedTasksCount: state.tasks.unfinishedTasksCount
});

export default connect(mapStateToProps, { fetchCompletedTasksCount, fetchUnfinishedTasksCount })(Tasks);
