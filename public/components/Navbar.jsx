import React from 'react';
import CreateAppointment from './CreateAppointment.jsx';

const Navbar = ({reminders, reminderInput, appointmentInput, createReminder, deleteReminder, createAppointment, updateReminder, updateAppointment}) => {

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

        </div>{/*<!-- /.navbar-collapse -->*/}
      </div>{/*<!-- /.container -->*/}
    </nav>
  );
};

export default Navbar;
