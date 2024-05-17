import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDiscussions, addDiscussion, updateDiscussion } from '../../actions/discussions';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Discussions = ({ user, auth, getDiscussions, addDiscussion, updateDiscussion, discussions }) => {
  if (!user) {
    return <div>Loading...</div>;
  }
  const [allUsernames, setAllUsernames] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [localdiscussions, setDiscussions] = useState([]);
  const [optionUsers, setOptionUsers] = useState([]);

  useEffect(() => {
    fetch('/api/company-users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${auth.token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        const filteredUsers = data.users.filter(user => user.username !== auth.user.username);
        setAllUsernames(filteredUsers);
        setOptionUsers(filteredUsers);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, [auth.token, auth.user]);

  useEffect(() => {
    getDiscussions();
  }, [getDiscussions]);

  useEffect(() => {
    const userDiscussions = discussions.filter(discussion =>
      discussion.users.includes(auth.user.id)
    );
    setDiscussions(userDiscussions);
  }, [discussions, auth.user.id]);

  const handleCreateDiscussion = () => {
    if (selectedUsers.length > 0 && newDiscussionTitle) {
      const userIds = [...new Set([...selectedUsers.map(user => user.id), auth.user.id])];
      const newDiscussion = {
        title: newDiscussionTitle,
        users: userIds,
        created_by: auth.user.id,
      };

      addDiscussion(newDiscussion).then(() => {
        setSelectedUsers([]);
        setNewDiscussionTitle('');
        getDiscussions();
      }).catch(error => {
        console.error("Error creating discussion: ", error);
      });
    }
  };

  const handleRemoveDiscussion = (e) => {
    const removedDiscussion = e;
    removedDiscussion.active = false;
    updateDiscussion(removedDiscussion);
    setDiscussions(localdiscussions.filter(discussion => discussion !== e));
  }

  return (
    <div>
      <h1>Discussions</h1>
      <div>
        <h2>Create a Discussion</h2>
        <Autocomplete
          multiple
          id="select-users-autocomplete"
          options={optionUsers}
          value={selectedUsers}
          getOptionLabel={(option) => option.username}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue);
          }}
          disabled={optionUsers.length === 0}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={optionUsers.length === 0 ? "No other users in your organization" : "Add Users"} />
          )}
        />
        <div style={{ marginTop: '20px' }}>
          <TextField
            label="Discussion Title"
            variant="outlined"
            fullWidth
            value={newDiscussionTitle}
            onChange={(e) => setNewDiscussionTitle(e.target.value)}
            disabled={optionUsers.length === 0}
          />
        </div>
        <button onClick={handleCreateDiscussion} style={{ marginTop: '20px' }}>Create Discussion</button>
      </div>
      <h2>All Discussions</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {localdiscussions.map((discussion) => (
          <li key={discussion.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#61677A'}}>
            <Link to={`/messages/${discussion.id}`} style={{ textDecoration: 'none', color: 'black', flex: 1 }} onMouseEnter={(e) => { e.currentTarget.parentElement.style.backgroundColor = '#d8d9da'; }} onMouseLeave={(e) => { e.currentTarget.parentElement.style.backgroundColor = '#61677A'; }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                Discussion: {discussion.title}
              </div>
              <div style={{ fontSize: '14px', color: '#111', marginBottom: '10px' }}>
                Created: {new Date(discussion.created_at).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}
              </div>
              <div style={{ fontSize: '14px', color: '#111' }}>
                To: {discussion.users.map(userId => 
                allUsernames.find(user => user.id === userId)?.username || 'You').join(', ')}
              </div>
            </Link>
            { discussion.created_by === auth.user.id && (<button onClick={() => handleRemoveDiscussion(discussion)} style={{ color: '#fff', backgroundColor:'#333'}}>Delete Discussion</button>)}
          </li>
        ))}
      </ul>
    </div>
  );
};

Discussions.propTypes = {
  user: PropTypes.object,
  auth: PropTypes.object.isRequired,
  discussions: PropTypes.array.isRequired,
  getDiscussions: PropTypes.func.isRequired,
  addDiscussion: PropTypes.func.isRequired,
  updateDiscussion: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  auth: state.auth,
  discussions: state.discussions.discussions,
});

export default connect(mapStateToProps, { getDiscussions, addDiscussion, updateDiscussion })(Discussions);
