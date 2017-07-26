import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';
import Calendar from './Calendar.jsx';
import moment from 'moment';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      newReminders: [],
      reminderInput: {
        minutes: ''
      },
      appointmentInput: {
        description: '',
        //end_date: '',
        end_date_time: '',
        location: '',
        //start_date: '',
        start_date_time: '',
        title: ''
      },
      events: [],
      profileInformation: [],
      currentEvent: false


    };
    this.createNewReminder = this.createNewReminder.bind(this);
    this.deleteNewReminder = this.deleteNewReminder.bind(this);
    this.createNewAppointment = this.createNewAppointment.bind(this);
    this.updateNewReminder = this.updateNewReminder.bind(this);
    this.updateNewAppointment = this.updateNewAppointment.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);

  }

  //Adds a reminder to the newReminders array in state
  createNewReminder() {
    this.setState((prevState) => {
      var minutes = parseInt(prevState.reminderInput.minutes, 10);
      prevState.newReminders.push(minutes);
      prevState.reminderInput.minutes = '';
      return {newReminders: prevState.newReminders,
        reminderInput: prevState.reminderInput};
    });
  }

  //Removes a reminder from the newReminders array in state
  deleteNewReminder(key) {
    this.setState((prevState) => {
      prevState.newReminders.splice(key, 1);
      return {newReminders: prevState.newReminders};
    });
  }

  //Posts an appointment with its reminders to the server
  createNewAppointment() {


    let startTime = moment(this.state.startTime).toArray();

    //let startDate = startTime[0] + '/' + startTime[1] + '/' + startTime[2]
    //console.log(startDate)
    let startDateTime = startTime[0] + '/' + startTime[1] + '/' + startTime[2] + ' ' + startTime[3] + ':' + startTime[4]
    //this.updateNewAppointment('start_date', startDate)
    this.updateNewAppointment('start_date_time', startDateTime)


    let endTime = moment(this.state.endTime).toArray();
    //let endDate = endTime[0] + '/' + endTime[1] + '/' + endTime[2]
    let endDateTime = endTime[0] + '/' + endTime[1] + '/' + endTime[2] + ' ' + endTime[3] + ':' + endTime[4]
    //this.updateNewAppointment('end_date', endDate)
    this.updateNewAppointment('end_date_time', endDateTime)


    var newAppointmentData = {};
    let type;
    let route;
    if (this.state.currentEvent === false) {
      type = 'POST'
      route = '/schedule'
    } else {
      type = 'PUT'
      route = '/schedule/' + this.state.currentEvent
    }

    for (var data in this.state.appointmentInput) {
      newAppointmentData[data] = this.state.appointmentInput[data];
    }

    newAppointmentData.reminders = this.state.newReminders;
    console.log('newAppointmentData', newAppointmentData);
    $.ajax({
      url: route,
      type: type,
      data: newAppointmentData,
      dataType: 'json',
      success: function(response) {
        let events = this.state.events;
        console.log('start', events)
        for (var i = 0; i < events.length; i++) {
          if (events[i].id === this.state.currentEvent) {
            events.splice(i, 1);
          }
        }
        console.log('middle', events)
        let start;
        let end;
        /*if (response.start_date_time.length !== 0) {
          start = this.mergeDateTime(response.start_date, response.start_date_time);
          end = this.mergeDateTime(response.end_date, response.end_date_time);
        } else {*/
          start = new Date(response.start_date_time);
          end = new Date(response.end_date_time);
        //}
        events.push({
          title: response.title,
          start: start,
          end: end,
          description: response.description,
          location: response.location,
          id: response.id
        })
        this.setState({
          newReminders: [],
          reminderInput: {
            minutes: ''
          },
          appointmentInput: {
            description: '',
            //end_date: '',
            end_date_time: '',
            location: '',
            //start_date: '',
            start_date_time: '',
            title: ''
          },
          events: events,
          currentEvent: false
        });
        console.log('end', this.state.events, this.state.currentEvent)
      }.bind(this),
      error: function(err) {
        console.error(err);
      }.bind(this)
    })
  }

  //Updates the input field object for reminders in state
  updateNewReminder(key, value) {
    this.setState((prevState) => {
      prevState.reminderInput[key] = value;
      return {
        reminderInput: prevState.reminderInput
      }
    });
  }

  deleteEvent() {
    console.log('test')
    $.ajax({
      url: '/schedule/' + this.state.currentEvent,
      type: 'DELETE',
      success: function(response) {
        let events = this.state.events
        for (var i = 0; i < events.length; i++) {
          if (events[i].id === this.state.currentEvent) {
            events.splice(i, 1);
          }
        }
        this.setState({
          newReminders: [],
          reminderInput: {
            minutes: ''
          },
          appointmentInput: {
            description: '',
            //end_date: '',
            end_date_time: '',
            location: '',
            //start_date: '',
            start_date_time: '',
            title: ''
          },
          events: events,
          currentEvent: false
        });
        console.log(response);
      }.bind(this),
      error: function(err) {
        console.error(err);
      }.bind(this)
    })
  }

  //Updates the input field object for appointments in state
  updateNewAppointment(key, value) {
    this.setState((prevState) => {
      prevState.appointmentInput[key] = value;
      return {
        appointmentInput: prevState.appointmentInput
      }
    });
  }


  mergeDateTime(date, dateTime) {
    //console.log('date', date)
    //console.log('dateTime', dateTime)
    let dateSplit = date.split('/');
    let dateTimeSplit = dateTime.split(':');

    let res = new Date(dateSplit[0], dateSplit[1], dateSplit[2], dateTimeSplit[0], dateTimeSplit[1]);
    //console.log(res)
    return res
  }

  selectEvent(event) {
    //console.log(event)
    //this.setState({currentEvent:event});
    //console.log(this.state.currentEvent);
    this.setState({
      newReminders: [],
      reminderInput: {
        minutes: ''
      },
      appointmentInput: {
        description: event.description,
        //end_date: event.end,
        end_date_time: event.end,
        location: event.location,
        //start_date: event.start,
        start_date_time: event.start,
        title: event.title
      },
      currentEvent: event.id
    });
    //console.log(this.state.appointmentInput)
  }


  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: '/profile',
      success: function(userInfo) {
        this.setState({profileInformation :userInfo})
        console.log("STATE ", this.state.profileInformation[0].name)
      }.bind(this),
      error: function(err) {
        console.error('Error in getting user information', err);
      }.bind(this)
    })

    $.ajax({
      type: 'GET',
      url: '/schedule',
      success: function(appointments) {
        console.log('APPOINtments: ', appointments);
        let events = [];
        //console.log(events)
        appointments.map((appointment, i) => {
          let start;
          let end;
          /*if (appointment.start_date_time.length !== 0) {
            start = this.mergeDateTime(appointment.start_date, appointment.start_date_time);
            end = this.mergeDateTime(appointment.end_date, appointment.end_date_time);
          } else {*/
            start = new Date(appointment.start_date_time);
            end = new Date(appointment.end_date_time);
          //}
          events.push({
            title: appointment.title,
            start: start,
            end: end,
            description: appointment.description,
            location: appointment.location,
            id: appointment.id
          })
        })
        //console.log(events)
        this.setState({events: events})
      }.bind(this),
      error: function(err) {
        console.error('Error in getting appointments', error);
      }.bind(this)
    })

  }

  // createUserProfile() {
  //   console.log('createUserProfile');
  // }


  render() {
    //console.log(this.state)
    $('.calendar-box').height($(window).height() - 50)
    return(
      <div>
        <Navbar
         reminders={this.state.newReminders}
         reminderInput={this.state.reminderInput}
         appointmentInput={this.state.appointmentInput}
         createReminder={this.createNewReminder}
         deleteReminder={this.deleteNewReminder}
         createAppointment={this.createNewAppointment}
         updateReminder={this.updateNewReminder}
         updateAppointment={this.updateNewAppointment}
         profileInformation={this.state.profileInformation}
         currentEvent={this.state.currentEvent}
         deleteEvent={this.deleteEvent}></Navbar>

        <div className='calendar-box'>
          <Calendar events={this.state.events} selectEvent={this.selectEvent} currentEvent={this.state.currentEvent}/>
        </div>
      </div>
    );
  }
}


/*
<Weekview></Weekview>
*/

