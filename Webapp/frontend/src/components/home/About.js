import React from 'react';

const About = () => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: '50px', maxWidth: '1200px', margin: 'auto' }}>
      <h1 style={{padding: '20px', textAlign: 'center'}}>About Us</h1>
      <div style={{fontSize: '18px'}}>
      <p>Welcome to WorkplaceWise! We're a group of college students dedicated to
        optimizing the way businesses manage their workforce, tasks, and office operations.
      </p>
      <p><b>Our Idea:</b></p>
      <p> At WorkplaceWise, we have developed a business dashboard that serves
        as a comprehensive solution for managing employees, scheduling tasks and meetings,
        and providing office management data. Our innovative platform is designed for
        businesses of all sizes by optimizing their internal operations.
      </p>
      <p><b>Our Goals:</b></p>
      <ul>
        <li><u>Performance Tracking:</u> Our mission is to provide individuals within businesses 
        with powerful tools to track their own performance and project progress. 
        With our dashboard, users can easily monitor and analyze key performance indicators, 
        enabling informed decision-making and personal growth.
        </li>
        <li>
          <u>Collaboration:</u> We understand the significance of project discussions, task 
          assignments, and effective communication. That's why our application seamlessly 
          integrates messaging, calendar planning with deadlines, and meeting scheduling. 
          By facilitating efficient teamwork and project management, we empower users to 
          collaborate effectively and achieve their goals with ease.
        </li>
      </ul>
      <p>We hope for you to join us on our journey to redefine the way businesses operate.</p>
      <p>— WorkplaceWise Developers</p>
      <p> Our Team:</p>
      <ul style={{position: 'relative'}} >
        <li style={{marginTop:'20px'}}><a href="https://github.com/RebeccaCun">Rebecca Cunningham</a> <span>Main Developer for Calendar, Notifications</span></li>
        <li style={{marginTop:'20px'}}><a href="https://github.com/DevGosho160">Devon Goshorn</a> <span>Main Developer for Discussions</span></li>
        <li style={{marginTop:'20px'}}><a href="https://github.com/hudsonhok">Hudson Hok</a> <span>Main Developer for Sign-up/Log-in, User Accounts/Account Settings, and Tasks</span></li>
        <li style={{marginTop:'20px'}}><a href="https://github.com/carsonmurr">Carson Murray</a> <span>Main Developer for Performance, User Profile, User Accounts/Account Settings, Navigation Bar/Side Menu</span></li>
        <p style={{marginTop: '30px'}}>Link to Github Repository: <a href='https://github.com/SCCapstone/logic-terrors'>logic-terrors</a></p>
      </ul>
      </div>
    </div>
  );
}

export default About;
