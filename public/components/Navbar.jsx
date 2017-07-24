import React from 'react';
import CreateAppointment from './CreateAppointment.jsx';
import UserProfile from './UserProfile.jsx';


const Navbar = ({reminders, reminderInput, appointmentInput, createReminder, deleteReminder, createAppointment, updateReminder, updateAppointment, profileInformation}) => {

  return (
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
          updateAppointment={updateAppointment}></CreateAppointment>

          <UserProfile
          profileInformation={profileInformation}
          createAppointment={createAppointment}>
          </UserProfile>

        {/*
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#">Link</a></li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="#">Separated link</a></li>
              </ul>
            </li>
          </ul>
        */}

        </div>{/*<!-- /.navbar-collapse -->*/}
      </div>{/*<!-- /.container -->*/}
    </nav>
  );
};

export default Navbar;
