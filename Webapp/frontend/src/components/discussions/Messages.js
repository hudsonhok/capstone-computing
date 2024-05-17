import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getMessages, addMessage, updateDiscussion } from '../../actions/discussions';
import { getDiscussions, addDiscussion } from '../../actions/discussions';
import { sendMessageEmailNotification } from '../../actions/auth';


const Messages = ({ user, auth, getMessages, addMessage, updateDiscussion, discussionMessages, discussions, sendMessageEmailNotification, getDiscussions, addDiscussion }) => {
    if (!user) {
        return <div>Loading...</div>;
      }
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [messageUsers, setMessageUsers] = useState({});
    const { discussionId } = useParams();
    const [discussion, setDiscussion] = useState(null);
    
    useEffect(() => {
        fetch('/api/all-users/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth.token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            const usersMap = data.users.reduce((acc, user) => {
                acc[user.id] = user.username;
                return acc;
            }, {});
            setMessageUsers(usersMap);
        })
        .catch(error => console.error('Error fetching users:', error));
    }, [auth.token, auth.user]);

    useEffect(() => {
        getMessages(discussionId);
    }, [getMessages, discussionId]);

    useEffect(() => {
        const dMessages = discussionMessages.filter(message => message.discussion == discussionId);
        setMessages(dMessages);
    }, [discussionMessages, discussionId]);

    useEffect(() => {
        const thisDiscussion = discussions.find(discussion => discussion.id == discussionId);
        setDiscussion(thisDiscussion);
    }, [discussions, discussionId]);

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (newMessage) {
            const newMessageObj = {
                discussion: discussionId,
                sender: auth.user.id,
                content: newMessage,
            };

            addMessage(newMessageObj);
            setMessages([...messages, newMessageObj]);
            setNewMessage('');
            let filter = discussion.users.filter((user) => user != auth.user.id)
            for (const diss_user in filter) {
                fetch('/api/company-users/', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Token ${auth.token}`,
                    },
                  }).then(response => response.json())
                  .then(data => {
                    let other_filter = data.users.find((user) => user.id == filter[diss_user]);
                    if(other_filter.allowNotifications && other_filter.notifyforMessages){checkForNotifications(other_filter)};
                  });
            }
        }
    };

    const checkForNotifications = (userIn) => {
        if(userIn.notifyThrough === "Messages") {
            fetch('/api/discussions/', {
                method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${auth.token}`,
                    },
                }).then(response => response.json())
                .then(data => {
                    let filter = data.find((diss) => diss.title == "System Notification: New Message in \""+discussion.title+"\"");
                    if(typeof filter == "undefined") {
                        const messageNotification = {
                            title: "System Notification: New Message in \""+discussion.title+"\"",
                            users: [...new Set([userIn.id, auth.user.id])], created_by: auth.user.id,
                        };
                        addDiscussion(messageNotification).then(() => {getDiscussions();});
                    }
                    getMessages();
                    getDiscussions();
                    fetch('/api/discussions/', {
                        method: 'GET',
                        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${auth.token}`,
                    },
                    }).then(response => response.json())
                    .then(data => {
                        let filter = data.find((diss) => diss.title ===  "System Notification: New Message in \""+discussion.title+"\"");
                        const message = {discussion: filter.id, sender: auth.user.id,
                        content: "Hello, there is a new message in the \""+discussion.title+"\" Discussion that you are a part of with "+(discussion.users.length-1)+" other person/people.",
                        };
                        addMessage(message);
                    });
                });
        }
        if(userIn.notifyThrough === "Email") {sendMessageEmailNotification({ participant_email: userIn.email, title: discussion.title, number_of_discussionUsers: discussion.users.length-1});}
    }

    const handleRemoveUser = (userId) => {
        if (discussion && discussion.created_by === auth.user.id) { 
            const updatedDiscussion = {
                ...discussion,
                users: discussion.users.filter(id => id !== userId),
            };
            updateDiscussion(updatedDiscussion)
            setDiscussion(updatedDiscussion);
        }
    };

    return (
        <div style={{paddingBottom:'60px'}}>
            <h2>Messages</h2>
            <Link to='/discussions'>
                {'◄'} Back
            </Link>
            <br/><br/>
            { discussion && discussion.created_by === auth.user.id && (
            <div className='col'>
                 <label style={{ marginRight: '8px' }}>Click User to remove them from the discussion:</label>
                {discussion && discussion.users.filter(user => user !== auth.user.id).map(userId => (
                    <button key={userId} onClick={() => handleRemoveUser(userId)}>
                        {messageUsers[userId] || 'Unknown User'}
                    </button>
                ))}
            </div>
            )}
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        <strong>{`${message.content}`}</strong>
                        <br />
                        From: {messageUsers[message.sender] || 'Unknown User'} Sent: {new Date(message.timestamp).toLocaleDateString('en-us', {year:'numeric',month:'long',day:'numeric'})}
                    </li>
                ))}
            </ul>
            <div className="input-group mb-3" style={{position:'fixed', left:'0', right:'0', bottom:'0', padding:'10px'}}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Message"
                    aria-label="Message"
                    aria-describedby="button-addon2"
                    value={newMessage}
                    onChange={handleMessageChange}
                />
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

Messages.propTypes = {
    user: PropTypes.object,
    auth: PropTypes.object.isRequired,
    discussionMessages: PropTypes.array.isRequired,
    discussions: PropTypes.array.isRequired,
    getMessages: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
    updateDiscussion: PropTypes.func.isRequired,
    sendMessageEmailNotification: PropTypes.func.isRequired,
    addDiscussion: PropTypes.func.isRequired,
    getDiscussions: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    auth: state.auth,
    discussionMessages: state.discussions.activeDiscussion.messages,
    discussions: state.discussions.discussions
});

export default connect(mapStateToProps, {
    getMessages,
    addMessage,
    updateDiscussion,
    sendMessageEmailNotification,
    getDiscussions,
    addDiscussion,
    getDiscussions,
})(Messages);
