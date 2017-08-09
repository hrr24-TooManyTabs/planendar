import React from 'react';
import DateTime from 'react-datetime'
import moment from 'moment'
import 'react-datetime/css/react-datetime.css'
import Popup from 'react-popup';

const CreateAppointment = ({reminders, reminderInput, appointmentInput, createReminder, deleteReminder, createAppointment, updateReminder, updateAppointment, currentEvent, deleteEvent, backToCreateAppointmentForm}) => {

  //Calls createReminder to add the new reminder to the state in App
  const handleCreateReminder = (e) => {
    e.preventDefault();
    if (reminderInput.minutes !== '') {
      createReminder();
    } else {
      console.error('require fields have not been filled out');
    }
  };

  //Calls deleteReminder to remove the reminder from the state in App
  const handleDeleteReminder = (e) => {
    e.preventDefault();
    deleteReminder(e.target.value);
  };

  //Calls createAppointment which will send the post request for creating
  //a new appointment to the database
  const handleCreateAppointment = (e) => {
    e.preventDefault();
    if ((appointmentInput.title !== '') &&
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
       (appointmentInput.start_date_time !== '') &&
       (appointmentInput.end_date_time !== '')) {

      let recipientEmail = prompt("Please enter the recipient's email address");

      let emailContent = {
        title: appointmentInput.title,
        description: appointmentInput.description,
        start_date_time: appointmentInput.start_date_time,
        end_date_time: appointmentInput.end_date_time,
        location: appointmentInput.location,
        user_id: recipientEmail
      }

      $.ajax({
        type: 'GET',
        url: '/users',
        success: function(users) {
          let userArray = []
          for (var i = 0; i < users.length; i++) {
            var currentObj = users[i];
            userArray.push(currentObj.email);
          }

          if(userArray.indexOf(recipientEmail) === -1) {
            alert('The email address you entered does not belong to an existing user');
            return;
          }

        }.bind(this),
        error: function(err) {
          console.error(err);
        }.bind(this)
      })

      $.ajax({
        url: '/sendAppointment',
        type: 'POST',
        data: emailContent,
        dataType: 'json',
        success: function(response) {
        }.bind(this),
        error: function(err) {
        }.bind(this)
      }).then()
    }
  }

  //Calls updateReminder to update the input state for reminders in App
  //This runs even ever a input field for reminders is changed
  const handleReminderChange = (e) => {
    updateReminder(e.target.name, e.target.value);
  };

  //Calls updateAppointment to update the input state for appointments in App
  //This runs even ever a input field for appointments is changed
  const handleAppointmentChange = (e) => {
    var value;

    if (e.target.name === 'isTrackingWeather') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    updateAppointment(e.target.name, value);
  };

  const handleStartChange = (e) => {
    updateAppointment('start_date_time', e._d)
  }

  const handleEndChange = (e) => {
    updateAppointment('end_date_time', e._d)
  }

  const handleBackToCreateAppointmentForm = (e) => {
    e.preventDefault();
    backToCreateAppointmentForm();
  };

  const appointmentButton = () => {
    if (currentEvent === false) {
      return (
        <span>
          <button type="submit" className="btn btn-default" onClick={handleCreateAppointment}>Create Appointment</button>
          &nbsp;
          <button className="btn btn-default" onClick={shareAppointment}>Share Appointment</button>
        </span>
      )
    } else {
      return (
        <span>
          <button className="btn btn-default" onClick={shareAppointment}>Share Appointment</button>
          &nbsp;
          <button type="submit" className="btn btn-default" onClick={handleCreateAppointment}>Update</button>
          &nbsp;
          <button className="btn btn-default" onClick={deleteEvent}>Delete</button>
          &nbsp;
          <button className="btn btn-default" onClick={handleBackToCreateAppointmentForm}>Cancel</button>
        </span>
      )
    }
  }

  return (
      <form className="navbar-form" method="post">

        <div className="row" id="top-form-top-row-remove-annoying-bottom-margin">
          <div className="col-md-12">

            <div className="form-group">
              <input maxLength="20" type="text" className="form-control" placeholder="Appointment Title" name="title" value={appointmentInput.title} onChange={handleAppointmentChange} required/>
            </div>

            <label>&nbsp;Start&nbsp;</label>
            <div className="form-group">
              <DateTime
                onChange={handleStartChange}
                value={appointmentInput.start_date_time}
              />
            </div>

            <label>&nbsp;Finish&nbsp;</label>
            <div className="form-group">
              <DateTime
                onChange={handleEndChange}
                value={appointmentInput.end_date_time}
              />
            </div>

            &nbsp;

            <div className="form-group">
              <ul className="nav navbar-nav">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Reminders <span className="caret"></span></a>
                  <ul className="dropdown-menu">
                    {reminders.map((reminder, i) => {
                      return (
                        <li key={i}>{reminder} min<button value={i} onClick={handleDeleteReminder}>Delete</button></li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </div>

            <button type="submit" className="btn btn-default" onClick={handleCreateReminder}>Add Reminder</button>

            &nbsp;

            <div className="form-group">
              <input type="number" min="0" max="60" step="5" className="form-control" placeholder="m" name="minutes" value={reminderInput.minutes} onChange={handleReminderChange} />
            </div>

          </div>
        </div>

        <div className="row">
          <div className="col-md-12">

            <div className="form-group">
              <textarea rows="1" cols="30" maxLength="20" className="form-control" placeholder="Description" name="description" id="description-field" value={appointmentInput.description} onChange={handleAppointmentChange}></textarea>
            </div>

            &nbsp;

            <div className="form-group">
              <textarea rows="1" cols="30" maxLength="20" className="form-control" placeholder="Location" name="location" value={appointmentInput.location} onChange={handleAppointmentChange}></textarea>
            </div>

            &nbsp;

            <div className="form-group">
              <input type="text" className="form-control" placeholder="city name" name="cityName" value={appointmentInput.cityName} onChange={handleAppointmentChange} />
            </div>

            &nbsp;

            <div className="checkbox">
              <label>
                <input
                 type="checkbox"
                 name="isTrackingWeather"
                 checked={appointmentInput.isTrackingWeather}
                 onChange={handleAppointmentChange}
                />
              &nbsp;Track Weather</label>
            </div>

            &nbsp;&nbsp;

            <div className="form-group">
              <select
                className="form-control"
                name="tag"
                onChange={handleAppointmentChange}
                value={appointmentInput.tag}
              >
                <option value="">select Tag</option>
                <option value="Work">Work</option>
                <option value="Play">Play</option>
              </select>
            </div>


          </div>
        </div>

        <div className="row" id="top-form-button-row">
          <div className="col-md-12">

            {appointmentButton()}

          </div>
        </div>

      </form>
  );
};

export default CreateAppointment;
