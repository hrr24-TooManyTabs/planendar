import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      newReminders: [0, 5, 10, 15]
    };
    this.createNewReminder = this.createNewReminder.bind(this);
    this.deleteNewReminder = this.deleteNewReminder.bind(this);
    this.createNewAppointment = this.createNewAppointment.bind(this);
  }

  createNewReminder() {
    console.log('createNewReminder');
  }

  deleteNewReminder() {
    console.log('deleteNewReminder');
  }

  createNewAppointment() {
    console.log('createNewAppointment');
  }

  render() {
    return(
      <div>
        <Navbar
         reminders={this.state.newReminders}
         createReminder={this.createNewReminder}
         deleteReminder={this.deleteNewReminder}
         createAppointment={this.createNewAppointment}></Navbar>
        <Weekview></Weekview>
      </div>
    );
  }
}
