import React from 'react';

const CreateAppointment = ({reminders, reminderInput, appointmentInput, createReminder, deleteReminder, createAppointment, updateReminder, updateAppointment}) => {

  const handleCreateReminder = (e) => {
    //console.log('handleCreateReminder');
    e.preventDefault();
    if (reminderInput.minutes !== '') {
      createReminder();
    } else {
      console.error('require fields have not been filled out');
    }
  };

  const handleDeleteReminder = (e) => {
    //console.log('handleDeleteReminder');
    //console.log('e.target.value', e.target.value);
    e.preventDefault();
    deleteReminder(e.target.value);
  };

  const handleCreateAppointment = (e) => {
    //console.log('handleCreateAppointment');
    e.preventDefault();
    if ((appointmentInput.title !== '') &&
      (appointmentInput.start_date !== '') &&
      (appointmentInput.start_date_time !== '') &&
      (appointmentInput.end_date_time !== '')) {
      createAppointment();
    } else {
      console.error('require fields have not been filled out');
    }
  };

  const shareAppointment = (e) => {
    e.preventDefault();
    if ((appointmentInput.title !== '') &&
      (appointmentInput.start_date !== '') &&
      (appointmentInput.start_date_time !== '') &&
      (appointmentInput.end_date_time !== '')) {
      let emailContent = {
        title: appointmentInput.title,
        start_date: appointmentInput.start_date,
        start_date_time: appointmentInput.start_date_time,
        end_date_time: appointmentInput.end_date_time
      }

      $.ajax({
      url: '/shareAppointment',
      type: 'POST',
      data: emailContent,
      dataType: 'json',
      success: function(response) {
        console.log('THIS IS WHAT YOU SENT: ', response);
      }.bind(this),
      error: function(err) {
        console.error(err);
      }.bind(this)
    })


    }
  }

  const handleReminderChange = (e) => {
    //console.log('handleReminderChange');
    //console.log('e.target.name', e.target.name);
    //console.log('e.target.value', e.target.value);
    updateReminder(e.target.name, e.target.value);
  };

  const handleAppointmentChange = (e) => {
    //console.log('handleAppointmentChange');
    //console.log('e.target.name', e.target.name);
    //console.log('e.target.value', e.target.value);
    updateAppointment(e.target.name, e.target.value);
  };

  return (
  /*<div>
    <h2>Navbar</h2>
    <form>
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <input type="submit" value="Submit" />
    </form>
    </div>*/

    <div>
      <form className="navbar-form">
        <button type="submit" className="btn btn-default" onClick={handleCreateAppointment}>Create Appointment</button>
        <button className="btn btn-default" onClick={shareAppointment}>Share Appointment</button>

        <div className="form-group">
          <input type="text" className="form-control" placeholder="Appointment Name" name="title" value={appointmentInput.title} onChange={handleAppointmentChange} required/>
        </div>

        <label>&ensp;Start</label>

        {/*
        <div className="form-group">
          <input type="datetime-local" className="form-control" placeholder="Start Date and Time"/>
        </div>
        */}

        <div className="form-group">
          <input type="date" className="form-control" placeholder="Start Date" name="start_date" value={appointmentInput.start_date} onChange={handleAppointmentChange} required/>
        </div>

        <div className="form-group">
          <input type="time" className="form-control" placeholder="Start Time" name="start_date_time" value={appointmentInput.start_date_time} onChange={handleAppointmentChange} required/>
        </div>

        <label>&ensp;Finish</label>
        <div className="form-group">
          <input type="date" className="form-control" placeholder="End Date" name="end_date" value={appointmentInput.end_date} onChange={handleAppointmentChange}/>
        </div>

        <div className="form-group">
          <input type="time" className="form-control" placeholder="End Time" name="end_date_time" value={appointmentInput.end_date_time} onChange={handleAppointmentChange} required/>
        </div>

        <div className="form-group">
          <textarea className="form-control" placeholder="Description" name="description" value={appointmentInput.description} rows="1" cols="148" onChange={handleAppointmentChange}></textarea>
        </div>

        <div className="form-group">
          <textarea className="form-control" placeholder="Location" name="location" value={appointmentInput.location} rows="1" cols="148" onChange={handleAppointmentChange}></textarea>
        </div>

      </form>

      <ul className="nav navbar-nav">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Reminders <span className="caret"></span></a>
          <ul className="dropdown-menu">
          {/*
            <li><a href="#">Action</a><button>Remove</button></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" className="divider"></li>
            <li><a href="#">Separated link</a></li>
          */}
            {reminders.map((reminder, i) => {
              return (
                <li key={i}>{reminder} min<button value={i} onClick={handleDeleteReminder}>Delete</button></li>
              );
            })}
          </ul>
        </li>
      </ul>

      <form className="navbar-form">
        <button type="submit" className="btn btn-default" onClick={handleCreateReminder}>Add Reminder</button>

        <div className="form-group">
          <input type="number" min="0" max="60" step="5" className="form-control" placeholder="m" name="minutes" value={reminderInput.minutes} onChange={handleReminderChange} required={true}/>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointment;
