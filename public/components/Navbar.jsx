import React from 'react';
import CreateAppointment from './CreateAppointment.jsx';
import UserProfile from './UserProfile.jsx';
import WeatherBar from './weatherBar.jsx';
import Summary from './Summary.jsx';

const Navbar = ({reminders, reminderInput, appointmentInput, createReminder, deleteReminder, createAppointment, updateReminder, updateAppointment, profileInformation, currentEvent, deleteEvent, forecastday, getWeather, backToCreateAppointmentForm}) => {

  return (
    <div>
    <nav className="navbar navbar-default">
      <div className="container">
        {/*<!-- Brand and toggle get grouped for better mobile display -->*/}
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">Planendar</a>
        </div>

        {/*<!-- Collect the nav links, forms, and other content for toggling -->*/}
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

          {/*<!-- The create appointment input form -->*/}
          <CreateAppointment
            reminders={reminders}
            reminderInput={reminderInput}
            appointmentInput={appointmentInput}
            createReminder={createReminder}
            deleteReminder={deleteReminder}
            createAppointment={createAppointment}
            updateReminder={updateReminder}
            updateAppointment={updateAppointment}
            currentEvent={currentEvent}
            deleteEvent={deleteEvent}
            backToCreateAppointmentForm={backToCreateAppointmentForm}
          >
          </CreateAppointment>

          <UserProfile
            profileInformation={profileInformation}
            createAppointment={createAppointment}
          >
          </UserProfile>
        </div>{/*<!-- /.navbar-collapse -->*/}
      </div>{/*<!-- /.container -->*/}
      <button data-toggle="collapse" data-target=".weather">Weather</button>
      <Summary></Summary>
    </nav>
    <div className="container-fluid weather collapse">
      <WeatherBar
      forecastday={forecastday}
      getWeather={getWeather}></WeatherBar>
    </div>
    </div>
  );
};

export default Navbar;
