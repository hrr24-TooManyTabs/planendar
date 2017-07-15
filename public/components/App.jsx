import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';

export default class App extends React.Component {

  render() {
    return(
      <div>
        <h1> Hello World! </h1>
        <Navbar></Navbar>
        <Weekview></Weekview>
      </div>
    );
  }
}
