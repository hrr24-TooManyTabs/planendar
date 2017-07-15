import React from 'react';

const CreateAppointment = ({reminders}) => {

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
        <button type="submit" className="btn btn-default">Create Appointment</button>

        <div className="form-group">
          <input type="text" className="form-control" placeholder="Name"/>
        </div>

        <div className="form-group">
          <input type="text" className="form-control" placeholder="Start Date"/>
        </div>

        <div className="form-group">
          <input type="text" className="form-control" placeholder="End Date"/>
        </div>

        <div className="form-group">
          <input type="text" className="form-control" placeholder="Start Time"/>
        </div>

        <div className="form-group">
          <input type="text" className="form-control" placeholder="End Time"/>
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
            {/*{reminders.map((reminder, i) => (
              return <li>{reminder}<button>Delete</button></li>;
            ))}*/}
          </ul>
        </li>
      </ul>

      <form className="navbar-form">
        <button type="submit" className="btn btn-default">Add Reminder</button>

        <div className="form-group">
          <input type="text" className="form-control" placeholder="Minutes before"/>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointment;
