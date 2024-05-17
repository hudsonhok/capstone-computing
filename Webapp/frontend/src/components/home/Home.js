import React from 'react';
import calendar from "../../../../media/screenshots/calendar.png";
//import discussion_main from "../../../../media/screenshots/discussion_main.jpg";
//import event_creation from "../../../../media/screenshots/event_creation.jpg";
//import meetings from "../../../../media/screenshots/meetings.jpg";
import messages from '../../../../media/screenshots/messages.png';
import performance from "../../../../media/screenshots/performance.png";
//import task_completion from "../../../../media/screenshots/task_completion.jpg";
import tasks from "../../../../media/screenshots/tasks.png";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to WorkplaceWise!</h1>
      <p className="home-description">
        WorkplaceWise is a collaborative platform designed to streamline communication
        and task management within your organization. Connect with your team, manage projects,
        and stay informed about important updates.
      </p>
      <h1 className="features-title">Our Features</h1>
      <div className="video-container">
        <p>Here is our Final Demo video where we discuss the many features of our application and the main cause/reasons for its creation. </p>
        <iframe
          width="900"
          height="600"
          src="https://www.youtube.com/embed/SXS3WOiHRfk"
          title="Final Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="row">
        <div className="pic-column">
          <h4>Messaging and Collaboration</h4>
          <img src={messages} className='img-fluid' alt="Messaging and Collaboration"/>
        </div>
        <div className="text-column">
          <p className = "left"> Collaboration is integral to an efficient and healthy work environment. Use WorkPlaceWise's discussion feature to create discussions with your colleagues. Stay connected with your team with our messaging and collaboration tools.</p>
        </div>
        <div className="text-column">
          <p className = "right"> Have a project or assignment that you would like to keep track of? Efficiently manage projects and add, edit, and remove tasks with our intuitive task management system.</p>
        </div>
        <div className="pic-column">
          <h4>Task Management</h4>
          <img src={tasks} className='img-fluid' alt="Task Management"/>
        </div>
        <div className="pic-column">
          <h4>Event Calendar</h4>
          <img src={calendar} className='img-fluid' alt="Event Calendar"/>
        </div>
        <div className="text-column">
        <p className = "left">Keep track of important deadlines and meetings with our integrated event calendar. You can add your colleagues to meetings so that everyone can be on track with your events. Mark your attendance on meetings, mitigate the hassle of remembering your schedule, and spend that time getting things done!</p>
        </div>
        <div className="text-column">
        <p className = "right">Gaining feedback on your performance is a important must for skill-building. Gain an automatic insight into your performance with our performance analytics. See if you are lacking in attendance, or check the tasks performance page to see how your task efficieny is doing. Take note of your results and improve from there!</p>
        </div>
        <div className="pic-column">
          <h4>Performance Analytics</h4>
          <img src={performance} className='img-fluid' alt="Performance Analytics"/>
        </div>
      </div>
    </div>
  );
}

export default Home;
