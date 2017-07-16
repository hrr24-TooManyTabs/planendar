import React from 'react';

const CreateAppointment = ({reminders, createReminder, deleteReminder, createAppointment}) => {


  const handleCreateReminder = (e) => {
    console.log('handleCreateReminder');
    console.log('e', e);
    createReminder();
  };

  const handleDeleteReminder = (e) => {
    console.log('handleDeleteReminder');
    console.log('e', e);
    deleteReminder();
  };

  const handleCreateAppointment = (e) => {
    console.log('handleCreateAppointment');
    console.log('e', e);
    createAppointment();
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

        <div className="form-group">
          <input type="text" className="form-control" placeholder="Name"/>
        </div>

        <label>&ensp;Start</label>

        {/*
        <div className="form-group">
          <input type="datetime-local" className="form-control" placeholder="Start Date and Time"/>
        </div>
        */}

        <div className="form-group">
          <input type="date" className="form-control" placeholder="Start Date"/>
        </div>

        <div className="form-group">
          <input type="time" className="form-control" placeholder="Start Time"/>
        </div>

        <label>&ensp;Finish</label>
        <div className="form-group">
          <input type="date" className="form-control" placeholder="End Date"/>
        </div>

        <div className="form-group">
          <input type="time" className="form-control" placeholder="End Time"/>
        </div>

        <div className="form-group">
          <textarea className="form-control" placeholder="Description" rows="1" cols="148"></textarea>
        </div>

      </form>

      <ul className="nav navbar-nav">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Reminders <span className="caret"></span></a>
          <ul className="dropdown-menu">
            <li><a href="#">Action</a><button>Remove</button></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" className="divider"></li>
            <li><a href="#">Separated link</a></li>
            {reminders.map((reminder, i) => {
              console.log('reminder: ', reminder);
              return (
                <li key={i}>{reminder} min<button onClick={handleDeleteReminder}>Delete</button></li>
              );
            })}
          </ul>
        </li>
      </ul>

      <form className="navbar-form">
        <button type="submit" className="btn btn-default" onClick={handleCreateReminder}>Add Reminder</button>

        <div className="form-group">
          <input type="number" min="0" max="60" step="5" className="form-control" placeholder="m"/>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointment;
