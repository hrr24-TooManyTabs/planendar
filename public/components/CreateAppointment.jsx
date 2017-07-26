import React from 'react';
import DateTime from 'react-datetime'
import moment from 'moment'
import 'react-datetime/css/react-datetime.css'

const CreateAppointment = ({reminders, reminderInput, appointmentInput, createReminder, deleteReminder, createAppointment, updateReminder, updateAppointment, currentEvent, deleteEvent}) => {

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
    //console.log('handleCreateAppointment');
    //console.log(appointmentInput)
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
        start_date_time: appointmentInput.start_date_time.toString(),
        end_date_time: appointmentInput.end_date_time.toString(),
        location: appointmentInput.location,
        user_id: recipientEmail
      }
      console.log('emailContent: ', emailContent);

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
        console.log('HERE ARE THE USERS ', userArray);
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
              console.error(err);
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
    updateAppointment(e.target.name, e.target.value);
  };

  const handleStartChange = (e) => {
    //console.log(e._d)
    /*let time = moment(e._d).toArray();
    let startDate = time[0] + '/' + time[1] + '/' + time[2]
    //console.log(startDate)
    let startDateTime = time[3] + ':' + time[4]*/
    //console.log(startDateTime)
    //let time = moment(e._d).to
    updateAppointment('start_date_time', e._d)
    //updateAppointment('start_date_time', startDateTime)
  }

  const handleEndChange = (e) => {
    /*let time = moment(e._d).toArray();
    let endDate = time[0] + '/' + time[1] + '/' + time[2]
    let endDateTime = time[3] + ':' + time[4]*/
    updateAppointment('end_date_time', e._d)
    //updateAppointment('end_date_time', endDateTime)
  }

  const appointmentButton = () => {
    if (currentEvent === false) {
      return (<button type="submit" className="btn btn-default" onClick={handleCreateAppointment}>Create Appointment</button>)
    } else {
      return (<div><button type="submit" className="btn btn-default" onClick={handleCreateAppointment}>Update</button><button type="submit" className="btn btn-default" onClick={deleteEvent}>Delete</button></div>)
    }
  }

  return (
    <div>
      <form className="navbar-form">
        <button className="btn btn-default" onClick={shareAppointment}>Share Appointment</button>




        <div className="form-group">
          <input maxLength="11" type="text" className="form-control" placeholder="Appointment Name" name="title" value={appointmentInput.title} onChange={handleAppointmentChange} required/>
        </div>

        <label>&ensp;Start</label>
        <div className="form-group">
          <DateTime onChange={handleStartChange} value={appointmentInput.start_date_time}/>
        </div>

        <label>&ensp;Finish</label>
        <div className="form-group">
          <DateTime onChange={handleEndChange} value={appointmentInput.end_date_time}/>
        </div>


        <div className="form-group">
          <textarea rows="1" cols="30" maxLength="17" className="form-control" placeholder="Description" name="description" value={appointmentInput.description} onChange={handleAppointmentChange}></textarea>
        </div>

        <div className="form-group">
          <textarea rows="1" cols="30" maxLength="17" className="form-control" placeholder="Location" name="location" value={appointmentInput.location} onChange={handleAppointmentChange}></textarea>
        </div>

        <label>&emsp;</label>

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

        <div className="form-group">
          <input type="number" min="0" max="60" step="5" className="form-control" placeholder="m" name="minutes" value={reminderInput.minutes} onChange={handleReminderChange} />
        </div>

        {appointmentButton()}
      </form>
    </div>
  );
};

export default CreateAppointment;


/*
<div className="form-group">
  <input type="date" className="form-control" placeholder="Start Date" name="start_date" value={appointmentInput.start_date} onChange={handleAppointmentChange} required/>
</div>

<div className="form-group">
  <input type="time" className="form-control" placeholder="Start Time" name="start_date_time" value={appointmentInput.start_date_time} onChange={handleAppointmentChange} required/>
</div>

<div className="form-group">
  <input type="date" className="form-control" placeholder="End Date" name="end_date" value={appointmentInput.end_date} onChange={handleAppointmentChange}/>
</div>

<div className="form-group">
  <input type="time" className="form-control" placeholder="End Time" name="end_date_time" value={appointmentInput.end_date_time} onChange={handleAppointmentChange} required/>
</div>


<div className="form-group">
  <input style={{fontSize: .7 + "em"}} type="date" className="form-control" placeholder="Start Date" name="start_date" value={appointmentInput.start_date} onChange={handleAppointmentChange} required/>
</div>

<div className="form-group">
  <input style={{fontSize: .7 + "em"}} type="time" className="form-control" placeholder="Start Time" name="start_date_time" value={appointmentInput.start_date_time} onChange={handleAppointmentChange} required/>
</div>

<label>&ensp;Finish</label>
<div className="form-group">
  <input style={{fontSize: .7 + "em"}} type="date" className="form-control" placeholder="End Date" name="end_date" value={appointmentInput.end_date} onChange={handleAppointmentChange}/>
</div>

<div className="form-group">
  <input style={{fontSize: .7 + "em"}} type="time" className="form-control" placeholder="End Time" name="end_date_time" value={appointmentInput.end_date_time} onChange={handleAppointmentChange} required/>
</div>
*/
