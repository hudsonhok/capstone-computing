import React from 'react';
import '../styles/Settings.css';
import { Link } from 'react-router-dom';
const HelpAndSupport = () => {
	return (
		<div className='container'>
			<h2>Help & Support</h2>
			<h3>Need help? Contact us:</h3>
			<h4>Email: Support@WorkplaceWise.com</h4>
			<h4>Phone: (803)-123-4567</h4>
			<div className='container' style={{textAlign:'center'}}>
				<Link to="/settings">Back</Link>
			</div>
		</div>
	);
};

export default HelpAndSupport;