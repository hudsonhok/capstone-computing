import React, { Component, Fragment } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell} from 'recharts';
import { Link } from 'react-router-dom';
import '../styles/Perfomance.css';
import { connect } from "react-redux";
import { fetchAttendedMeetingsCount, fetchUnattendedMeetingsCount } from '../../actions/calendarEvents';
import { fetchCompletedTasksCount, fetchUnfinishedTasksCount } from '../../actions/tasks';


class Performance extends Component {
  state = {
    loading: true,
    completedTasksCount: null,
    unfinishedTasksCount: null,
    attendedMeetingsCount: null,
    unattendedMeetingsCount: null,
    taskCompletionPercentage: null,
    meetingCompletionPercentage: null,
    timeRange: 'all_time',  // set to all_time automatically
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
      await this.props.fetchAttendedMeetingsCount(timeRange);
      await this.props.fetchUnattendedMeetingsCount(timeRange);

      this.setState({ loading: false });
      const { completedTasksCount, unfinishedTasksCount, attendedMeetingsCount, unattendedMeetingsCount} = this.props;

      // Calculate Task completion percentage
      const totalTasksCount = completedTasksCount + unfinishedTasksCount;
      const taskCompletionPercentage = totalTasksCount === 0 ? 0 : (completedTasksCount / totalTasksCount) * 100;

      // Calculate Meeting completion percentage
      const totalMeetingsCount = attendedMeetingsCount + unattendedMeetingsCount;
      const meetingCompletionPercentage = totalMeetingsCount === 0 ? 0 : (attendedMeetingsCount / totalMeetingsCount) * 100;


      this.setState({ completedTasksCount, unfinishedTasksCount, attendedMeetingsCount, unattendedMeetingsCount, taskCompletionPercentage, meetingCompletionPercentage, chartKey: Date.now() });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ loading: false });
    }
  };

    // Initiates a fetch for data if the time range changes
  handleTimeRangeChange = (event) => {
    const timeRange = event.target.value;
    this.setState({ timeRange }, () => {
      this.fetchData();
    });
  };



  render() {
    const { loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

  const { taskCompletionPercentage, meetingCompletionPercentage, attendedMeetingsCount, unattendedMeetingsCount, completedTasksCount, unfinishedTasksCount, timeRange, chartKey } = this.state;

  const RADIAN = Math.PI / 180;

  // Data for the Speedometer
  const data = [
    { name: 'A', value: 50, color: 'red' },
    { name: 'B', value: 50, color: 'yellow' },
    { name: 'C', value: 50, color: 'green' },
  ];

  // Task data
  const taskSummary = [
    {task: "Tasks Completed", value: 300},
    {task: "Tasks Not Completed", value: 25},
  ]

// set up for the speedometer
  const cx = window.innerWidth/2;  // gets the instantaneous center of the window
  const cy = 200;
  const iR = 50;
  const oR = 200;
  var value = 0;
  
  // calculating value of the speedometer
  if (completedTasksCount == 0 && unfinishedTasksCount == 0) {
    // Case where there are no tasks but there are meetings created
    value = 25 + meetingCompletionPercentage;
    console.log(value);
  } else if(attendedMeetingsCount == 0 && unattendedMeetingsCount == 0) {
    // Case where there are no meetings but there are tasks created
    value = 25 + taskCompletionPercentage;
  } else if(attendedMeetingsCount == 0 && unattendedMeetingsCount == 0 && completedTasksCount == 0 && unfinishedTasksCount == 0) {
    // Case where there are no tasks or meetings created
    value = 0;
  } else{
    // Case where there are meetings and tasks
    var temp = ((taskCompletionPercentage/ 2) + (meetingCompletionPercentage / 2));
    value = 25 + temp;  // position of the needle
  }

  // Color to number corresponding values:
  // 25 = Red
  // 75 = Yellow
  // 125 = Green

  // setup for the speedometer needle
  const needle = (value, data, cx, cy, iR, oR, color) => {

  let total = 0;
  data.forEach((v) => {
    total += v.value;
  }); 
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
  ];
};
  const totalMeetingsCount = attendedMeetingsCount + unattendedMeetingsCount;
  const totalTasksCount = completedTasksCount + unfinishedTasksCount;
  if (totalMeetingsCount + totalTasksCount == 0) {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }} className='mb-4'>Perfomance and Statistics</h1>
        <h2 style={{ textAlign: 'center' }} className='mb-4'>No statistics are currently available, add a task or event to get started</h2>
      </div>
    );
  } else {
    return (
      <div>

                  <h1 style={{ textAlign: 'center' }} className='mb-4'>Perfomance and Statistics</h1>

        <h2>Overall Perfomance</h2>
                  {/* Speedometer  */}
      <ResponsiveContainer width='99%' height={300}>
        <PieChart width={1350} height={3400}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx = {cx}
            cy={cy}
            innerRadius={iR}
            outerRadius={oR}
            fill="#8884d8"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell style={{outline: 'none'}} key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
           {needle(value, data, cx, cy, iR, oR, 'black')}

        </PieChart>
      </ResponsiveContainer>

      <h1 style={{ textAlign: 'center' }} className='mb-4'><u>Analysis of Your Perfomance:</u></h1>

        {/* Conditional text based on the value of the speedometer */}

          {/* Messages for a Red Speedometer value */}

            {/* EDGE CASE: No Meetings made but tasks made */}
                  {value > 0 && value <= 50 && (attendedMeetingsCount + unattendedMeetingsCount == 0) &&
                    <h2>
                      Based on your current task completion percentage, your performance needs improvement. Consider focusing on completing more tasks as your overall task completion percentage
                      is: {taskCompletionPercentage.toFixed(2)}%.
                    </h2>
                  }

            {/* EDGE CASE: No tasks made but meetings made */}
                {value > 0 && value <= 50 && (completedTasksCount + unfinishedTasksCount == 0) &&
                    <h2>
                      Based on your current meeting attendance, your performance needs improvement. Consider focusing on attending more meetings as your overall meeting attendance percentage
                      is: {meetingCompletionPercentage.toFixed(2)}%.
                    </h2>
                  }

        {/* Task Completion < Meeting Completion*/}
        {value > 0 && value <= 50 && taskCompletionPercentage < meetingCompletionPercentage && (completedTasksCount + unfinishedTasksCount != 0 && attendedMeetingsCount + unattendedMeetingsCount != 0) &&
        <h2>
          Your current performance needs improvement, consider focusing on completing more tasks as your overall task completion percentage
          is: {taskCompletionPercentage.toFixed(2)}%.
          {/* Your current performance needs improvement. Please review your goals and metrics to identify areas for enhancement. */}
        </h2>
        }

        {/* Task Completion > Meeting Completion*/}
        {value > 0 && value <= 50 && taskCompletionPercentage > meetingCompletionPercentage && (completedTasksCount + unfinishedTasksCount != 0 && attendedMeetingsCount + unattendedMeetingsCount != 0) &&
        <h2>
          Your current performance needs improvement, consider focusing on improving your meeting attendance as your overall meeting
          attendance percentage is: {meetingCompletionPercentage.toFixed(2)}%.          
        {/* Your current performance needs improvement. Please review your goals and metrics to identify areas for enhancement. */}
        </h2>
        }
        {/* Task Completion == Meeting Completion*/}
        {value > 0 && value <= 50 &&taskCompletionPercentage == meetingCompletionPercentage && (completedTasksCount + unfinishedTasksCount != 0 && attendedMeetingsCount + unattendedMeetingsCount != 0) &&
        <h2>
          Your current performance needs improvement, complete more tasks and attend more meetings to improve your rating.
          {/* Your current performance needs improvement. Please review your goals and metrics to identify areas for enhancement. */}
        </h2>
        }


        {/* Messages for a Yellow Speedometer value */}
                {/* EDGE CASE: No Meetings made but tasks made */}
                  {value > 50 && value <= 100 && (attendedMeetingsCount + unattendedMeetingsCount == 0) &&
                    <h2>
                      Based on your current task completion percentage, your performance is moderate. Consider focusing on completing more tasks as your overall task completion percentage
                      is: {taskCompletionPercentage.toFixed(2)}%.
                    </h2>
                  }

            {/* EDGE CASE: No tasks made but meetings made */}
                {value > 50 && value <= 100 && (completedTasksCount + unfinishedTasksCount == 0) &&
                    <h2>
                      Based on your current meeting attendance, your performance is moderate. Consider focusing on attending more meetings as your overall meeting attendance percentage
                      is: {meetingCompletionPercentage.toFixed(2)}%.
                    </h2>
                  }
        {/* Task Completion < Meeting Completion*/}
        {value > 50 && value <= 100 && taskCompletionPercentage < meetingCompletionPercentage && (completedTasksCount + unfinishedTasksCount != 0 && attendedMeetingsCount + unattendedMeetingsCount != 0) &&
        <h2>
          Your performance is moderate. Consider focusing on improving your task completion to increase your rating as your overall 
          task completion is: {taskCompletionPercentage.toFixed(2)}%.
        </h2>
        }

        {/* Task Completion > Meeting Completion*/}
        {value > 50 && value <= 100 && taskCompletionPercentage > meetingCompletionPercentage && (completedTasksCount + unfinishedTasksCount != 0 && attendedMeetingsCount + unattendedMeetingsCount != 0) &&
        <h2>
          Your performance is moderate. Consider focusing on improving your meeting attendance to increase your rating as your overall 
          attendance is: {meetingCompletionPercentage.toFixed(2)}%.
        </h2>
        }
        
        {/* Task Completion == Meeting Completion*/}
        {value > 50 && value <= 100 && taskCompletionPercentage == meetingCompletionPercentage && (completedTasksCount + unfinishedTasksCount != 0 && attendedMeetingsCount + unattendedMeetingsCount != 0) &&
        <h2>
          Your performance is moderate. To increase your rating attend more meetings and complete more tasks.
        </h2>
        }


        {/* Message for a Green Speedometer value */}
              {/* EDGE CASE: No Meetings made but tasks made */}
                {value > 100 && (attendedMeetingsCount + unattendedMeetingsCount == 0) &&
                    <h2>
                      Based on your current task completion percentage, your performance is great! Keep up the good work!
                    </h2>
                  }

            {/* EDGE CASE: No tasks made but meetings made */}
                {value > 100 && (completedTasksCount + unfinishedTasksCount == 0) &&
                    <h2>
                      Based on your current meeting attendance, your performance is great! Keep up the good work!
                    </h2>
                  }
        {value > 100 && (completedTasksCount + unfinishedTasksCount != 0 && attendedMeetingsCount + unattendedMeetingsCount != 0) &&
        <h2>
          Your overall performance is great! Keep up the good work!
        </h2>
        }
        <br/>
        <br/>
        {/* Buttons for tasks and meeting attendance */}
            <div style={{textAlign:'center'}}>
                <Link to="/performance/tasks">Tasks</Link>
                <Link to="/performance/attendance">Attendance</Link>
            </div>
      </div>


    );
      }
  }
}

const mapStateToProps = state => ({
  attendedMeetingsCount: state.events.attendedMeetingsCount,
  unattendedMeetingsCount: state.events.unattendedMeetingsCount,
  completedTasksCount: state.tasks.completedTasksCount,
  unfinishedTasksCount: state.tasks.unfinishedTasksCount
});

export default connect(mapStateToProps, { fetchAttendedMeetingsCount,fetchUnattendedMeetingsCount, fetchCompletedTasksCount,
    fetchUnfinishedTasksCount})(Performance);
