import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      newReminders: [0, 5, 10, 15]
    };
  }

  render() {
    return(
      <div>
        <Navbar reminders={this.state.newReminders}></Navbar>
        <Weekview></Weekview>
      </div>
    );
  }
}
