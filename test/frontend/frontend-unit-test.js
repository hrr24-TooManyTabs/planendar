var React = require('react');
var TestUtils = require('react-dom/test-utils'); //I like using the Test Utils, but you can just use the DOM API instead.
var expect = require('expect.js');
import App from '../../public/components/App.jsx';
import Navbar from '../../public/components/Navbar.jsx';
import CreateAppointment from '../../public/components/CreateAppointment.jsx'
//var App = require('../../public/components/App.jsx'); //my root-test lives in components/__tests__/, so this is how I require in my components.

describe('sanity check', function() {
  it('true should equal true', function() {
    expect(true).to.equal(true);
  });
});

describe('app', function () {
  it('renders app without problems', function () {
    var app = TestUtils.renderIntoDocument(<App/>);
    //console.log('app', app);
    expect(app).toExist;
  });
});

describe('navbar', function () {
  it('renders navbar without problems', function () {
    var navbar = TestUtils.renderIntoDocument(<Navbar
      reminders={[]}
      reminderInput={{minutes: ''}}
      appointmentInput={{
        description: '',
        end_date: '',
        end_date_time: '',
        location: '',
        start_date: '',
        start_date_time: '',
        title: ''
      }}
      createReminder={function(){}}
      deleteReminder={function(){}}
      createAppointment={function(){}}
      updateReminder={function(){}}
      updateAppointment={function(){}}/>);
    //console.log('navbar', navbar);
    expect(navbar).toExist;
  });
});


describe('createAppointment', function () {
  it('renders createAppointment without problems', function () {
    var createAppointment = TestUtils.renderIntoDocument(<CreateAppointment       reminders={[]}
      reminderInput={{minutes: ''}}
      appointmentInput={{
        description: '',
        end_date: '',
        end_date_time: '',
        location: '',
        start_date: '',
        start_date_time: '',
        title: ''
      }}
      createReminder={function(){}}
      deleteReminder={function(){}}
      createAppointment={function(){}}
      updateReminder={function(){}}
      updateAppointment={function(){}}/>);
    //console.log('createAppointment', createAppointment);
    expect(createAppointment).toExist;
  });
});
