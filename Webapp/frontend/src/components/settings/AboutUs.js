import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className='container'>
      <h2>About Us</h2>
      <p>Welcome to WorkplaceWise! We're a group of college students dedicated to
        optimizing the way businesses manage their workforce, tasks, and office operations.
      </p>
      <p>Our Idea: At WorkplaceWise, we have developed a business dashboard that serves as a 
        comprehensive solution for managing employees, scheduling tasks and meetings, and 
        providing office management data. Our innovative platform is designed for businesses 
        of all sizes by optimizing their internal operations.
      </p>
      <p>Our Goals:</p>
      <ul>
        <li>Performance Tracking: At WorkplaceWise, we have developed a business dashboard 
          that serves as a comprehensive solution for managing employees, scheduling tasks 
          and meetings, and providing office management data. Our innovative platform is 
          designed for businesses of all sizes by optimizing their internal operations.
        </li>
        <li>
          Collaboration: We understand the significance of project discussions, 
          task assignments, and effective communication. That's why our 
          application seamlessly integrates messaging, calendar planning 
          with deadlines, and meeting scheduling. By facilitating efficient 
          teamwork and project management, we empower users to collaborate 
          effectively and achieve their goals with ease.
        </li>
      </ul>
      <p>We hope for you to join us on our journey to redefine the way businesses operate.</p>
      <p>— WorkplaceWise Developers</p>
      <div className='container' style={{ textAlign: 'center' }}>
        <Link to="/settings">Back</Link>
      </div>
    </div>
  );
};

export default AboutUs;
