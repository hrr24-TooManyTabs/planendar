import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';
import Calendar from './Calendar.jsx';

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
        end_date: '',
        end_date_time: '',
        //location: '',
        start_date: '',
        start_date_time: '',
        title: ''
      },
      events: []

    };
    this.createNewReminder = this.createNewReminder.bind(this);
    this.deleteNewReminder = this.deleteNewReminder.bind(this);
    this.createNewAppointment = this.createNewAppointment.bind(this);
    this.updateNewReminder = this.updateNewReminder.bind(this);
    this.updateNewAppointment = this.updateNewAppointment.bind(this);
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
    var newAppointmentData = {};

    for (var data in this.state.appointmentInput) {
      newAppointmentData[data] = this.state.appointmentInput[data];
    }
    newAppointmentData.reminders = this.state.newReminders;
    console.log('newAppointmentData', newAppointmentData);
    $.ajax({
      url: '/schedule',
      type: 'POST',
      data: newAppointmentData,
      dataType: 'json',
      success: function(response) {
        let events = this.state.events;
        let start = this.mergeDateTime(response.start_date, response.start_date_time);
        let end = this.mergeDateTime(response.end_date, response.end_date_time);
        events.push({
          title: response.title,
          start: start,
          end: end
        })
        this.setState({
          newReminders: [],
          reminderInput: {
            minutes: ''
          },
          appointmentInput: {
            description: '',
            end_date: '',
            end_date_time: '',
            location: '',
            start_date: '',
            start_date_time: '',
            title: ''
          },
          events: events
        });
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
    let dateSplit = date.split('-');
    let dateTimeSplit = dateTime.split(':');

    let res = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], dateTimeSplit[0], dateTimeSplit[1]);
    //console.log(res)
    return res
  }

/*  getAppointments() {
    $.ajax({
      type: 'GET',
      url: '/schedule',
      success: function(appointments) {
        //console.log(appointments)
        let events = [];
        //console.log(events)
        appointments.map((appointment, i) => {
          let start = this.mergeDateTime(appointment.start_date, appointment.start_date_time);
          let end = this.mergeDateTime(appointment.end_date, appointment.end_date_time);
          events.push({
            title: appointment.title,
            start: start,
            end: end
          })
        })
        //console.log(events)
        this.setState({events: events})
        console.log(this.state.events)
      }.bind(this),
      error: function(err) {
        console.error('Error in getting appointments', error);
      }.bind(this)
    });
  }*/

  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: '/schedule',
      success: function(appointments) {
        console.log(appointments)
        let events = [];
        //console.log(events)
        appointments.map((appointment, i) => {
          let start = this.mergeDateTime(appointment.start_date, appointment.start_date_time);
          let end = this.mergeDateTime(appointment.end_date, appointment.end_date_time);
          events.push({
            title: appointment.title,
            start: start,
            end: end
          })
        })
        //console.log(events)
        this.setState({events: events})
        console.log('App', this.state.events);
      }.bind(this),
      error: function(err) {
        console.error('Error in getting appointments', error);
      }.bind(this)
    });
  }

  render() {
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
         updateAppointment={this.updateNewAppointment}></Navbar>

        <Calendar events={this.state.events}/>

      </div>
    );
  }
}


/*
<Weekview></Weekview>
*/


