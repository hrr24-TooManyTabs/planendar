import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      newReminders: ['0', '5', '10', '15']
      reminderInput: {
        minutes: ''
      }
      appointmentInput: {
        desciption: '',
        end_date: '',
        end_date_time: '',
        location: '',
        start_date: '',
        start_datae_time: '',
        title: ''
      }
    };
    this.createNewReminder = this.createNewReminder.bind(this);
    this.deleteNewReminder = this.deleteNewReminder.bind(this);
    this.createNewAppointment = this.createNewAppointment.bind(this);
    this.updateNewReminder = this.updateNewReminder.bind(this);
    this.updateNewAppointment = this.updateNewAppointment.bind(this);
  }

  createNewReminder() {
    console.log('createNewReminder');
    this.setState((prevState) => {
      return {newReminders: prevState.push(prevState.reminderInput.minutes),
        reminderInput: {minutes: 0}};
    });
  }

  deleteNewReminder(key) {
    console.log('deleteNewReminder');
    this.setState((prevState) => {
      prevState.newReminders.splice(key, 1);
      return {newReminders: prevState.newReminders};
    });
  }

  createNewAppointment() {
    console.log('createNewAppointment');
    $.ajax({
      url: '/appointments',
      type: 'POST',
      data: this.state.appointmentInput,
      dataType: 'json',
      success: function(response) {
        console.log('success', response);
        this.setState({
          appointmentInput: {
            desciption: '',
            end_date: '',
            end_date_time: '',
            location: '',
            start_date: '',
            start_datae_time: '',
            title: ''
          }
        });
      },
      error: function(err) {
        console.error(err);
      }
    })
  }

  updateNewReminder(key, value) {
    console.log('updateNewReminder');
    this.setState({
      reminderInput: {
        key: value
      }
    });
  }

  updateNewAppointment(key, value) {
    console.log('updateNewAppointment');
    this.setState({
      appointmentInput: {
        key: value
      }
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
        <Weekview></Weekview>
      </div>
    );
  }
}
