import React from 'react';
import Navbar from './Navbar.jsx';
import Calendar from './Calendar.jsx';
import moment from 'moment';
import Popup from 'react-popup';

export default class App extends React.Component {
  constructor () {
    super ();
    this.state = {
      newReminders: [],
      reminderInput: {
        minutes: ''
      },
      appointmentInput: {
        description: '',
        end_date_time: '',
        location: '',
        start_date_time: '',
        title: '',
        cityName: '',
        isTrackingWeather: false,
        tag: ''
      },
      events: [],
      profileInformation: [],
      currentEvent: false,
      notifications: {},
      selectedCity: '',
      forecastday: [],
      weather: [],
      color: []
    };

    this.createNewReminder = this.createNewReminder.bind(this);
    this.deleteNewReminder = this.deleteNewReminder.bind(this);
    this.createNewAppointment = this.createNewAppointment.bind(this);
    this.updateNewReminder = this.updateNewReminder.bind(this);
    this.updateNewAppointment = this.updateNewAppointment.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.backToCreateAppointmentForm = this.backToCreateAppointmentForm.bind(this);

  };

  backToCreateAppointmentForm () {
    this.setState({
      newReminders: [],
      reminderInput: {
        minutes: ''
      },
      appointmentInput: {
        description: '',
        end_date_time: '',
        location: '',
        start_date_time: '',
        title: '',
        cityName: '',
        isTrackingWeather: false,
        tag: ''
      },
      currentEvent: false
    });
  };

  //Adds a reminder to the newReminders array in state
  createNewReminder () {
    this.setState((prevState) => {
      var minutes = parseInt(prevState.reminderInput.minutes, 10);
      prevState.newReminders.push(minutes);
      prevState.reminderInput.minutes = '';
      return {
        newReminders: prevState.newReminders,
        reminderInput: prevState.reminderInput
      };
    });
  };

  //Removes a reminder from the newReminders array in state
  deleteNewReminder (key) {
    this.setState((prevState) => {
      prevState.newReminders.splice(key, 1);
      return {
        newReminders: prevState.newReminders
      };
    });
  };

  //Posts an appointment with its reminders to the server
  createNewAppointment () {
    var newAppointmentData = {};
    let type;
    let route;
    if (this.state.currentEvent === false) {
      type = 'POST';
      route = '/schedule';
    } else {
      type = 'PUT';
      route = '/schedule/' + this.state.currentEvent;
    }

    for (var data in this.state.appointmentInput) {
      newAppointmentData[data] = this.state.appointmentInput[data];
    }

    newAppointmentData.reminders = this.state.newReminders;
    newAppointmentData.approved = true;

    $.ajax({
      url: route,
      type: type,
      data: newAppointmentData,
      dataType: 'json',
      success: function (response) {
        let events = this.state.events;

        for (var i = 0; i < events.length; i++) {
          if (events[i].id === this.state.currentEvent) {
            events.splice(i, 1);
          }
        }

        if (this.state.currentEvent) {
          let existingNotifications = this.state.notifications;
          for (let notification in existingNotifications) {
            if (existingNotifications[notification]['appointmentId'] === this.state.currentEvent) {
              this.setState(prevState => {
                delete prevState.notifications[notification];
              });
            }
          }
        }

        let start = new Date(response.start_date_time);
        let end = new Date(response.end_date_time);
        let newNotification;

        if (response.reminders && response.reminders.length > 0) {
          response.reminders.forEach ((reminder) => {
              let notificationTime = new Date (start);
              notificationTime.setMinutes(notificationTime.getMinutes() - reminder.minutes);
              this.setState((prevState) => {
                prevState.notifications[notificationTime] = {
                  appointmentId: response.id,
                  minutes: reminder.minutes,
                  appointmentTitle: response.title,
                  appointmentDescription: response.description
                }
              });
          });
        }

        events.push({
          title: response.title,
          start: start,
          end: end,
          description: response.description,
          location: response.location,
          id: response.id,
          cityName: response.cityName,
          isTrackingWeather: response.isTrackingWeather,
          tag: response.tag,
          reminders: response.reminders
        })
        this.setState({
          newReminders: [],
          reminderInput: {
            minutes: ''
          },
          appointmentInput: {
            description: '',
            end_date_time: '',
            location: '',
            start_date_time: '',
            title: '',
            cityName: '',
            isTrackingWeather: false,
            tag: ''
          },
          events: events,
          currentEvent: false
        });
      }.bind(this),
      error: function (err) {
        console.error(err);
      }.bind(this)
    });
  };

  //Updates the input field object for reminders in state
  updateNewReminder (key, value) {
    this.setState((prevState) => {
      prevState.reminderInput[key] = value;
      return {
        reminderInput: prevState.reminderInput
      }
    });
  };


  deleteEvent (e) {
    e.preventDefault();
    $.ajax({
      url: '/schedule/' + this.state.currentEvent,
      type: 'DELETE',
      success: function (response) {
        let existingNotifications = this.state.notifications;

        for (let notification in existingNotifications) {
          if (existingNotifications[notification]['appointmentId'] === this.state.currentEvent) {
            this.setState(prevState => {
              delete prevState.notifications[notification];
            });
          }
        }

        let events = this.state.events;
        for (var i = 0; i < events.length; i++) {
          if (events[i].id === this.state.currentEvent) {
            events.splice(i, 1);
          }
        }

        this.setState({
          newReminders: [],
          reminderInput: {
            minutes: ''
          },
          appointmentInput: {
            description: '',
            end_date_time: '',
            location: '',
            start_date_time: '',
            title: '',
            cityName: '',
            isTrackingWeather: false,
            tag: ''
          },
          events: events,
          currentEvent: false
        });
      }.bind(this),
      error: function (err) {
        console.error(err);
      }.bind(this)
    })
  };

  //Updates the input field object for appointments in state
  updateNewAppointment (key, value) {
    this.setState((prevState) => {
      prevState.appointmentInput[key] = value;
      return {
        appointmentInput: prevState.appointmentInput
      }
    });
  };

  mergeDateTime (date, dateTime) {
    let dateSplit = date.split('/');
    let dateTimeSplit = dateTime.split(':');
    let res = new Date(dateSplit[0], dateSplit[1], dateSplit[2], dateTimeSplit[0], dateTimeSplit[1]);
    return res;
  };

  selectEvent (event) {
    let isTracking = event.isTrackingWeather;
    //The database is storing the isTrackingWeather as string
      //but the checkbox expects a boolean
    if (typeof isTracking === 'string') {
      isTracking = (isTracking === 'true');
    }
    let reminders = [];
    if (event.reminders) {
      for (var i = 0; i < event.reminders.length; i++) {
        reminders.push(event.reminders[i].minutes);
      }
    }

    this.setState({
      newReminders: reminders,
      reminderInput: {
        minutes: ''
      },
      appointmentInput: {
        description: event.description,
        //end_date: event.end,
        end_date_time: event.end,
        location: event.location,
        //start_date: event.start,
        start_date_time: event.start,
        title: event.title,
        cityName: event.cityName,
        isTrackingWeather: isTracking,
        tag: event.tag
      },
      currentEvent: event.id
    });

    //Only shows the weather for appointments tracking the weather
    if (isTracking) {
      $.ajax({
        url: '/allWeather',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
          this.setState({
            weather: response
          });
          this.popupWeather(event);
        }.bind(this),
        error: function (err) {
          console.error(err);
        }.bind(this)
      });
    }
  };

  popupWeather(event) {
    let forecastcity
    let forecastday;
    let forecasthour;
    let startDate = event.start;
    let currentYear = startDate.getFullYear();
    let currentMonth = startDate.getMonth() + 1;
    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth;
    }
    let currentDay = startDate.getDate();
    if (currentDay < 10) {
      currentDay = '0' + currentDay;
    }
    let currentDate = currentYear + '-' + currentMonth + '-' + currentDay;
    let currentHour = startDate.getHours();
    let forecastDetails = '';

    //Gets the hourly data and formats it
    if (this.state.weather) {
      for (let i = 0; i < this.state.weather.length; i++) {
        if (this.state.weather[i].location && this.state.weather[i].location.name === event.cityName) {
          forecastcity = this.state.weather[i].forecast.forecastday;
          break;
        }
      }
    }

    if (forecastcity) {
      for (let i = 0; i < forecastcity.length; i++) {
        if (forecastcity[i].date === currentDate) {
          forecastday = forecastcity[i];
          break;
        }
      }

      if (forecastday) {
        forecasthour = forecastday.hour[currentHour];
        forecastDetails += forecasthour.condition.text + '\n';
        forecastDetails += forecasthour.temp_c + ' ˚C\n';
        forecastDetails += forecasthour.temp_f + ' ˚F\n';
        forecastDetails += 'wind speed: ' + forecasthour.wind_mph + ' mph\n';
        forecastDetails += 'wind direction: ' + forecasthour.wind_dir;
      } else {
        forecastDetails = 'No weather data available'
      }
    } else {
      forecastDetails = 'No weather data available!';
    }
    //Creates a pop up with addtional information when an appointment is clicked
    Popup.create({
      title: event.cityName,
      content: forecastDetails,
      noOverlay: true
    });
  };

  getWeather (selectedCity) {
    var data = {
      city: selectedCity
    };

    $.ajax({
      url: '/allWeather',
      type: 'GET',
      data: data,
      dataType: 'json',
      success: function (response) {
        this.setState(() => {
          //find the selected city in the map data
          var forecastday = [];

          for (var i = 0; i < response.length; i++) {
            if (response[i].location.name === selectedCity) {
              forecastday = response[i].forecast.forecastday;
              break;
            }
          }
          return {
            selectedCity: selectedCity,
            forecastday: forecastday,
            weather: response
          };
        });
      }.bind(this),
      error: function (err) {
        console.error(err);
      }.bind(this)
    });
  };

  componentDidMount () {
    $.ajax({
      type: 'GET',
      url: '/profile',
      success: function (userInfo) {
        this.setState({profileInformation: userInfo})
      }.bind(this),
      error: function (err) {
        console.error('Error in getting user information', err);
      }.bind(this)
    });


    $.ajax({
      type: 'GET',
      url: '/schedule',
      success: function (appointments) {
        let events = [];
        let notifications = {};
        appointments.map((appointment, i) => {
          //if the appointment has not yet been approved from the email, cancel the operation
          if (appointment.approved === 0) {
            return;
          }

          let start;
          let end;
          start = new Date(appointment.start_date_time);
          end = new Date(appointment.end_date_time);

          if (appointment.reminders.length > 0) {
            appointment.reminders.forEach((reminder) => {
                let notificationTime = new Date(start);
                notificationTime.setMinutes(notificationTime.getMinutes() - reminder.minutes);
                notifications[notificationTime] = {
                  appointmentId: appointment.id,
                  minutes: reminder.minutes,
                  appointmentTitle: appointment.title,
                  appointmentDescription: appointment.description
                };
            });
          }
          events.push({
            title: appointment.title,
            start: start,
            end: end,
            description: appointment.description,
            location: appointment.location,
            id: appointment.id,
            cityName: appointment.cityName,
            isTrackingWeather: appointment.isTrackingWeather,
            tag: appointment.tag,
            reminders: appointment.reminders
          })
        })
        this.setState({events: events});
        this.setState({notifications: notifications});
      }.bind(this),
      error: function (err) {
        console.error('Error in getting appointments', error);
      }.bind(this)
    });

    let startTickingForNotification = setInterval(() => {
      let currentTime = '' + new Date();
      if (this.state.notifications[currentTime]) {
        let currentNotification = this.state.notifications[currentTime];
        let title = currentNotification.appointmentTitle;
        let minutes = currentNotification.minutes;
        this.browserNotify(title, minutes);
      }
    }, 1000);

    $.ajax({
      url: '/allWeather',
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        this.setState({
          weather: response
        });
      }.bind(this),
      error: function (err) {
        console.error(err);
      }.bind(this)
    });
  };

  browserNotify (body, minutes) {
    document.getElementById('notification-sound').play();
    // react notification package: https://www.npmjs.com/package/react-web-notification
    // sound example: https://github.com/georgeOsdDev/react-web-notification/tree/develop/example
    Push.create('Reminder!', {
      body: minutes + ' minutes remaining for ' + body,
      icon: './images/alarm-3.png',
      timeout: 50000,               // Timeout before notification closes automatically.
      vibrate: [100, 100, 100],    // An array of vibration pulses for mobile devices.
      onClick: function () {
        // Callback for when the notification is clicked.
        window.focus(); this.close();
      }
    });
  };

  render () {
    $('.calendar-box').height($(window).height() - 50);

    return(
      <div>
        <Navbar
          reminders={this.state.newReminders}
          reminderInput={this.state.reminderInput}
          appointmentInput={this.state.appointmentInput}
          createReminder={this.createNewReminder}
          deleteReminder={this.deleteNewReminder}
          createAppointment={this.createNewAppointment}
          updateReminder={this.updateNewReminder}
          updateAppointment={this.updateNewAppointment}
          profileInformation={this.state.profileInformation}
          currentEvent={this.state.currentEvent}
          deleteEvent={this.deleteEvent}
          forecastday={this.state.forecastday}
          getWeather={this.getWeather}
          backToCreateAppointmentForm={this.backToCreateAppointmentForm}>
        </Navbar>

        <Calendar
          events={this.state.events}
          selectEvent={this.selectEvent}
          currentEvent={this.state.currentEvent}
          createAppointment={this.createNewAppointment}
          updateAppointment={this.updateNewAppointment}
          colorInfo={this.state.color}>
        </Calendar>

        <audio id="notification-sound" preload="auto">
          <source src='./sounds/Metal-ding-sound-effect.mp3' type='audio/mpeg' />
          <embed hidden='true' autoPlay='false' loop='false' src='./sounds/Metal-ding-sound-effect.mp3' />
        </audio>
      </div>
    );
  };
};
