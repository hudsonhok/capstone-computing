import React, { useEffect, Component, Fragment} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {getEvents, addEvent, deleteEvent, updateEvent, addEventToAll} from '../../actions/calendarEvents';
import { getDiscussions, addDiscussion, addMessage, getMessages } from '../../actions/discussions';
import { sendEventEmailNotification } from '../../actions/auth';
import { createMessage } from '../../actions/messages';
import { withAlert } from 'react-alert';

import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import '../styles/Calendar.css';

function StartEnd ({startStr, endStr, allDay, description, attendance}) {
  if (description == "") description = "No description given.";
  if (allDay) return <div> 
                       <p>Date: {startStr}</p> 
                       <p>Description: {description}</p> 
                     </div>
  else {
    let date = new Date(startStr);
    let formattedDate = (date.getMonth()+1)+"-"+date.getDate()+"-"+date.getFullYear();
    let formattedStartTime = date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true,});
    let formattedEndTime = new Date(endStr).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true,});
    return <div> 
            <p>Date: {formattedDate}</p> 
            <p>Start time: {formattedStartTime}</p> 
            <p>End time: {formattedEndTime}</p> 
            <p>Description: {description}</p> 
            <p>Attending: {attendance ? 'Yes' : 'No'} </p>
          </div>
  }
}

// Establishes the Calendar front-end
// Uses the JavaScript fullCalendar component and plugin for added functionality and ease
// See here: https://fullcalendar.io/
export class Calendar extends Component {
  calendarRef = React.createRef();

  static propTypes = {
    events: PropTypes.array.isRequired,    
    getEvents: PropTypes.func.isRequired,
    addEventToAll: PropTypes.func.isRequired,
    addEvent: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    addDiscussion: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
    getDiscussions: PropTypes.func.isRequired,
    sendEventEmailNotification: PropTypes.func.isRequired,
  };

  state = {
    token: localStorage.getItem('token'),
    desModal: false,
    cancelModal: false,
    addModal: false,
    meetingModal: false,
    deadlineModal: false,
    attendModal: false,
    event: {
      id: "",
      title: "",
      start: "",
      end: "",
      allDay: false,
      attended: false,
      description: ""
    },
    description: "",
    attended: false,
    companyUsers: null,
    participants: []
  };

  componentDidMount() {
    this.props.getEvents();
    this.props.getDiscussions();
  }

  toggleAdd = () => {this.setState({ addModal: !this.state.addModal });};
  toggleMeeting = () => {this.setState({ meetingModal: !this.state.meetingModal });};
  toggleDeadline = () => {this.setState({ deadlineModal: !this.state.deadlineModal });};
  toggleCancel = () => {this.setState({ cancelModal: !this.state.cancelModal });};
  toggleDescription = () => {this.setState({ desModal: !this.state.desModal });};
  toggleAttendance = () => {this.setState({ attendModal: !this.state.attendModal });};

  toggleDescriptionShowCancel = () => {
    this.toggleDescription();
    this.toggleCancel();
  };

  toggleDescriptionShowAttendance = () => {
    this.toggleDescription();
    this.toggleAttendance();
  };

  AttendButton = ({allDay}) => {if(!allDay) {return <Button id="attendButton" color="primary" onClick={this.toggleDescriptionShowAttendance}> Confirm Attendance</Button>}}

  toggleAddShowMeeting = () => {
    fetch('/api/company-users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.state.token}`,
      },
    }).then(response => response.json())
    .then(data => {
      let newData = data.users.filter(user => user.username !== this.props.auth.user.username);
      this.setState({ companyUsers: newData });
      this.toggleAdd();
      this.toggleMeeting();
    });
  };

  toggleAddShowDeadline = () => {
    fetch('/api/company-users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.state.token}`,
      },
    }).then(response => response.json())
    .then(data => {
      let newData = data.users.filter(user => user.username !== this.props.auth.user.username);
      this.setState({ companyUsers: newData });      
      this.toggleAdd();
      this.toggleDeadline();
    });
  };

  handleEventClick = ({ event }) => {
    this.setState({ event });
    this.setState({description: event.extendedProps.description});
    this.setState({attended: event.extendedProps.attended});
    this.toggleDescription();
  };

  HandleAttendance = () => {
    let { events } = this.props;
    let canceledEvent = events.find((event) => (event.title === this.state.event.title));
    this.props.updateEvent(canceledEvent.id, { attended: document.getElementById('attendance').value });
    // this.props.updateAttendance(this.state.event.title, this.state.event.attended);
    this.toggleAttendance();
  }

  cancelEvent = () => {
    let { events } = this.props;
    let canceledEvent = events.find((event) => (event.title === this.state.event.title));
    
    this.props.deleteEvent(canceledEvent.id);
    this.calendarRef.current.getApi().getEventById(this.state.event.id).remove();

    this.calendarRef.current.getApi().refetchEvents();
    this.toggleCancel();
  }

  checkForParticipants = () => {
    if(this.state.participants.length != 0) {
      console.log(this.state.participants);
      for (let j = 0; j < this.state.participants[(this.state.participants.length-1)].length; j++) {
        console.log(this.state.participants[(this.state.participants.length-1)][j].id);
        const add = {
          creator: this.state.participants[(this.state.participants.length-1)][j].id,
          title: this.state.event.title,
          start: this.state.event.start,
          end: this.state.event.end,
          allDay: this.state.event.allDay,
          description: this.state.event.description
        };
        this.props.addEventToAll(add);
        if(this.state.participants[(this.state.participants.length-1)][j].allowNotifications && this.state.participants[(this.state.participants.length-1)][j].notifyforEvents){this.checkForNotifications(this.state.participants[(this.state.participants.length-1)][j])};
      }
    }
  }

  checkForNotifications = (participant) => {
    if(participant.notifyThrough === "Messages") {
      fetch('/api/discussions/', {
        method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.state.token}`,
            },
        }).then(response => response.json())
        .then(data => {
            let filter = data.find((diss) => diss.title == "System Notification: New Event \""+this.state.event.title+"\"");
            if(typeof filter == "undefined") {
              const messageNotification = {
                title: "System Notification: New Event \""+this.state.event.title+"\"",
                users: [...new Set([participant.id, this.props.auth.user.id])], created_by: this.props.auth.user.id,
              };
              this.props.addDiscussion(messageNotification).then(() => {this.props.getDiscussions();});
              this.componentDidMount();
            }
            getMessages();
            getDiscussions();
            fetch('/api/discussions/', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.state.token}`,
            },
            }).then(response => response.json())
            .then(data => {
              let filter = data.find((diss) => diss.title ===  "System Notification: New Event \""+this.state.event.title+"\"");
              const message = {discussion: filter.id, sender: this.props.auth.user.id,
                content: "You have been added to the event \""+this.state.event.title+"\" as an participant. \nThis event was created by user "+this.props.auth.user.username+".",
              };
              this.props.addMessage(message);
            });
        });
    }
    if(participant.notifyThrough === "Email") {this.props.sendEventEmailNotification({ participant_email: participant.email, title: this.state.event.title, sender: this.props.auth.user.username });}
  }

  addMeeting = () => {
    const {alert} = this.props;
    let date1 = new Date(document.getElementById('meeting_date').value+"T"+document.getElementById('meeting_start').value);
    let date2 = new Date(document.getElementById('meeting_date').value+"T"+document.getElementById('meeting_end').value);
    if (document.getElementById('meeting_title').value === "") {
      alert.error('Title cannot be blank.');
      this.toggleMeeting();
    }
    else if (document.getElementById('meeting_date').value === "") {
      alert.error('Invalid date.');
      this.toggleMeeting();
    }
    else if (document.getElementById('meeting_start').value === "") {
      alert.error('Invalid start time.');
      this.toggleMeeting();
    }
    else if (document.getElementById('meeting_end').value === "") {
      alert.error('Invalid end time.');
      this.toggleMeeting();
    }      
    else if (document.getElementById('meeting_des').value.length > 500) {
      alert.error('Description cannot be longer than 500 characters. \nPlease shorten the description.');
      this.toggleMeeting();
    } 
    else if (document.getElementById('meeting_title').value.length > 200) {4
      alert.error('Title cannot be longer than 200 characters. \nPlease shorten the title.');
      this.toggleMeeting();
    } 
    else if (date1>date2) {
      alert.error('The end time of a meeting must be after the start time.');
      this.toggleMeeting();
    }
    else {
      this.state.event.title=document.getElementById('meeting_title').value;
      this.state.event.start=document.getElementById('meeting_date').value+"T"+document.getElementById('meeting_start').value;
      this.state.event.end=document.getElementById('meeting_date').value+"T"+document.getElementById('meeting_end').value;
      this.state.event.description=document.getElementById("meeting_des").value;

      this.checkForParticipants();
      this.props.addEvent(this.state.event);
      this.calendarRef.current.getApi().refetchEvents();
      this.toggleMeeting();

      let currentDate = new Date();
      if(currentDate>date1) alert.error('FYI: You are scheduling a meeting for a date that has already passed.');
    }
  }

  addDeadline = () => {
    const {alert} = this.props;
    if (("["+document.getElementById('urgency').value+"] "+document.getElementById('deadline_title').value).length > 200) {
      alert.error('Title + Urgency cannot be longer than 200 characters. \nPlease shorten the title.');
      this.toggleDeadline();
    }  
    else if (document.getElementById('deadline_title').value === "") {
      alert.error('Title cannot be blank');
      this.toggleDeadline();
    }
    else if (document.getElementById('deadline_date').value === "") {
      alert.error('Invalid date.');
      this.toggleDeadline();
    }
    else if (document.getElementById('deadline_des').value.length > 500) {
      alert('Description cannot be longer than 500 characters. \nPlease shorten the description.');
      this.toggleDeadline();
    }
    else {
      let titleEdit = "["+document.getElementById('urgency').value+"] "+document.getElementById('deadline_title').value
      this.state.event.title = titleEdit;
      this.state.event.start = document.getElementById('deadline_date').value;
      this.state.event.allDay = true;
      this.state.event.description=document.getElementById("deadline_des").value;

      this.checkForParticipants();
      this.props.addEvent(this.state.event);
      this.calendarRef.current.getApi().refetchEvents();
      this.toggleDeadline();

      let currentDate = new Date();
      if(currentDate>(new Date(document.getElementById('deadline_date').value))) alert('FYI: You are creating a deadline with a date that has already passed.');
    }
  }

  render() {
    const { auth } = this.props;
    if (!auth.user) {
      return <div>Loading...</div>;
    }
    return(
      <Fragment>
        <Fullcalendar //Establishes the Calendar
          ref={this.calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={"dayGridMonth"}
          events={this.props}
          eventColor={'#2c3e50'}
          customButtons={{
            addEventButton: {
              text: 'Add Event',
              click: this.toggleAdd
            },
          }}
          headerToolbar={{
            start: 'title',
            center: 'today addEventButton',
            end: 'prev,next',
          }}
          eventClick={this.handleEventClick}
        />

        <Modal
          isOpen={this.state.desModal}
          toggle={this.toggleDescription}
          className={this.props.className}>
          <ModalHeader toggle={this.toggleDescription}>
            {this.state.event.title}
          </ModalHeader>
          <ModalBody>
            <div>
              <StartEnd
                startStr = {this.state.event.startStr}
                endStr = {this.state.event.endStr}
                allDay = {this.state.event.allDay}
                description = {this.state.description}
                attendance={this.state.attended} 
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleDescriptionShowCancel}> Cancel Event</Button>{" "}
            <this.AttendButton allDay = {this.state.event.allDay}/>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.attendModal}
          toggle={this.toggleAttendance}
          className={this.props.className}>
          <ModalHeader toggle={this.toggleAttendance}>
            Attendance of {this.state.event.title}
          </ModalHeader>
          <ModalBody>
            <div>
              <p>Did you attend/are you planning on attending this meeting?</p>
              <select name="choice" id="attendance">
              <option value = {true}>Yes</option>
              <option value = {false}>No</option>
              </select>
          </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.HandleAttendance}> Confirm Attendance</Button>{" "}
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.cancelModal}
          toggle={this.toggleCancel}
          className={this.props.className}>
          <ModalHeader toggle={this.toggleCancel}>
            Cancel {this.state.event.title}?
          </ModalHeader>
          <ModalBody>
            <div>
              <p>Reason for cancellation:</p>
              <input type="text" id="cancelReason"></input>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.cancelEvent}> Confirm</Button>{" "}
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.addModal}
          toggle={this.toggleAdd}
          className={this.props.className}>
          <ModalHeader toggle={this.addModal}>
            Add Event
          </ModalHeader>
          <ModalBody>
            <div>
              <p>This event is a...</p>
              <Button color="primary" onClick={this.toggleAddShowMeeting}> Meeting</Button>{" "}
              <Button color="primary" onClick={this.toggleAddShowDeadline}> Deadline</Button>{" "}
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.meetingModal}
          toggle={this.toggleMeeting}
          className={this.props.className}>
          <ModalBody>
            <section>
              <div style={{float: "left", marginRight:20}}>
                <label htmlFor="meeting_title"> Title</label>
                <input id="meeting_title" type="text"/>
              </div>
              <div style={{float: "left"}}>
                <Autocomplete
                  multiple
                  id="meeting_parti"
                  options={this.state.companyUsers}
                  getOptionLabel={(option) => option.username}
                  style={{width: 189}}
                  onChange={(event, newValue) => {this.state.participants.push(newValue);}}
                  renderInput={(params) => (<TextField {...params} variant="outlined" label="Select Participants" placeholder="Add Participants" />)}
                  noOptionsText = {"You have no other users in your organization."}                
                />             
              </div>
              <br style={{clear: "both"}} />
            </section>

            <section>
              <label htmlFor="meeting_date">Date:</label> 
              <input id="meeting_date" type="date"/> <p/>
            </section>

            <section>
              <div style={{float: "left", marginRight:20}}>
                <label htmlFor="meeting_start">Start time:</label>
                <input id="meeting_start" type="time" placeholder="HH:MM"/>
              </div>
              <div style={{float: "left"}}>
                <label htmlFor= "meeting_end">End time:</label>
                <input id="meeting_end" type="time" placeholder="HH:MM"/>
              </div>
              <br style={{clear: "both"}} />
            </section>

            <section>
              <label htmlFor="meeting_des">Description:</label> 
              <textarea style= {{display: "block"}} id="meeting_des" rows="5" cols="51"/>
            </section>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addMeeting}> Confirm</Button>{" "}
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.deadlineModal}
            toggle={this.toggleDeadline}
            className={this.props.className}>
            <ModalBody>
              <section>
                <div style={{float: "left", marginRight:20}}>
                  <label htmlFor="deadline_title"> Title</label>
                  <input id="deadline_title" type="text"/>
                </div>
                <div style={{float: "left"}}>
                  <Autocomplete
                    multiple
                    id="meeting_parti"
                    options={this.state.companyUsers}
                    getOptionLabel={(option) => option.username}
                    style={{width: 189}}
                    onChange={(event, newValue) => {this.state.participants.push(newValue);}}
                    renderInput={(params) => (<TextField {...params} variant="outlined" label="Select Participants" placeholder="Add Participants" />)}
                    noOptionsText = {"You have no other users in your organization."}                                
                  />    
                </div>
                <br style={{clear: "both"}} />
              </section>

              <section>
                <div style={{float: "left", marginRight:20}}>
                  <label htmlFor="deadline_date">Date:</label>
                  <input id="deadline_date" type="date" placeholder="HH:MM"/>
                </div>
                <div style={{float: "left", paddingLeft: 47}}>
                  <label htmlFor= "urgency">Urgency:</label>
                  <select style= {{display: "block"}} id="urgency" name="choice">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <br style={{clear: "both"}} />
              </section>

              <section>
                <label htmlFor="deadline_des">Description:</label> 
                <textarea style= {{display: "block"}} id="deadline_des" rows="5" cols="51"/>
              </section>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addDeadline}> Confirm</Button>{" "}
            </ModalFooter>
          </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({auth: state.auth, events: state.events.events,});
  
export default connect(mapStateToProps, {
  getEvents, addEvent, addEventToAll, deleteEvent, updateEvent,
  getDiscussions, addDiscussion, addMessage, getMessages,
  sendEventEmailNotification,
  createMessage,
})(withAlert()(Calendar));