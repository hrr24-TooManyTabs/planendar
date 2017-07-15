import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';

export default class App extends React.Component {

  render() {
    return(
      <div>
        <Navbar></Navbar>
        <Weekview></Weekview>
      </div>
    );
  }
}
