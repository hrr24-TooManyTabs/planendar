import React from 'react';
import Navbar from './Navbar.jsx';
import Weekview from './Weekview.jsx';
import Calendar from './Calendar.jsx';
import moment from 'moment';
import Popup from 'react-popup';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      newReminders: [],
      reminderInput: {
        minutes: ''
      },
      appointmentInput: {
        description: '',
        //end_date: '',
        end_date_time: '',
        location: '',
        //start_date: '',
        start_date_time: '',
        title: '',
        cityName: '',
        isTrackingWeather: false
      },
      events: [],
      profileInformation: [],
      currentEvent: false,
      notifications: {},
      selectedCity: '',
      forecastday: [],
      weather: []
    };
    this.createNewReminder = this.createNewReminder.bind(this);
    this.deleteNewReminder = this.deleteNewReminder.bind(this);
    this.createNewAppointment = this.createNewAppointment.bind(this);
    this.updateNewReminder = this.updateNewReminder.bind(this);
    this.updateNewAppointment = this.updateNewAppointment.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.getWeather = this.getWeather.bind(this);


  }

  //Adds a reminder to the newReminders array in state
  createNewReminder() {
    this.setState((prevState) => {
      var minutes = parseInt(prevState.reminderInput.minutes, 10);
      prevState.newReminders.push(minutes);
      prevState.reminderInput.minutes = '';
      return {newReminders: prevState.newReminders,
        reminderInput: prevState.reminderInput};
    });
  }

  //Removes a reminder from the newReminders array in state
  deleteNewReminder(key) {
    this.setState((prevState) => {
      prevState.newReminders.splice(key, 1);
      return {newReminders: prevState.newReminders};
    });
  }

  //Posts an appointment with its reminders to the server
  createNewAppointment() {


    let startTime = moment(this.state.startTime).toArray();

    //let startDate = startTime[0] + '/' + startTime[1] + '/' + startTime[2]
    //console.log(startDate)
    let startDateTime = startTime[0] + '/' + startTime[1] + '/' + startTime[2] + ' ' + startTime[3] + ':' + startTime[4]
    //this.updateNewAppointment('start_date', startDate)
    this.updateNewAppointment('start_date_time', startDateTime)


    let endTime = moment(this.state.endTime).toArray();
    //let endDate = endTime[0] + '/' + endTime[1] + '/' + endTime[2]
    let endDateTime = endTime[0] + '/' + endTime[1] + '/' + endTime[2] + ' ' + endTime[3] + ':' + endTime[4]
    //this.updateNewAppointment('end_date', endDate)
    this.updateNewAppointment('end_date_time', endDateTime)


    var newAppointmentData = {};
    let type;
    let route;
    if (this.state.currentEvent === false) {
      type = 'POST'
      route = '/schedule'
    } else {
      type = 'PUT'
      route = '/schedule/' + this.state.currentEvent
    }

    for (var data in this.state.appointmentInput) {
      newAppointmentData[data] = this.state.appointmentInput[data];
    }

    newAppointmentData.reminders = this.state.newReminders;
    //console.log('newAppointmentData', newAppointmentData);
    $.ajax({
      url: route,
      type: type,
      data: newAppointmentData,
      dataType: 'json',
      success: function(response) {
        // console.log('createAppointment response', response);
        let events = this.state.events;
        // console.log('start', events)
        for (var i = 0; i < events.length; i++) {
          if (events[i].id === this.state.currentEvent) {
            events.splice(i, 1);
          }
        }
        // console.log('middle', events)
        let start;
        let end;
        let newNotification;
        /*if (response.start_date_time.length !== 0) {
          start = this.mergeDateTime(response.start_date, response.start_date_time);
          end = this.mergeDateTime(response.end_date, response.end_date_time);
        } else {*/
          start = new Date(response.start_date_time);
          end = new Date(response.end_date_time);

          if(response.reminders.length > 0) {
            response.reminders.forEach((reminder) => {
                let notificationTime = new Date(start);
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
          console.log('notifications state after add new appointment', this.state.notifications);

        //}
        events.push({
          title: response.title,
          start: start,
          end: end,
          description: response.description,
          location: response.location,
          id: response.id,
          cityName: response.cityName,
          isTrackingWeather: response.isTrackingWeather
        })
        this.setState({
          newReminders: [],
          reminderInput: {
            minutes: ''
          },
          appointmentInput: {
            description: '',
            //end_date: '',
            end_date_time: '',
            location: '',
            //start_date: '',
            start_date_time: '',
            title: '',
            cityName: '',
            isTrackingWeather: false
          },
          events: events,
          currentEvent: false
        });
        // console.log('end', this.state.events, this.state.currentEvent)
      }.bind(this),
      error: function(err) {
        console.error(err);
      }.bind(this)
    });
  }

  //Updates the input field object for reminders in state
  updateNewReminder(key, value) {
    this.setState((prevState) => {
      prevState.reminderInput[key] = value;
      return {
        reminderInput: prevState.reminderInput
      }
    });
  }

  deleteEvent(e) {
    e.preventDefault();
    // console.log('notifications before delete schedule', this.state.notifications);
    // console.log('currentEvent at delete', this.state.currentEvent);
    // return;
    $.ajax({
      url: '/schedule/' + this.state.currentEvent,
      type: 'DELETE',
      success: function(response) {
        let existingNotifications = this.state.notifications;
        for(let notification in existingNotifications) {
          if(existingNotifications[notification]['appointmentId'] === this.state.currentEvent) {
            this.setState(prevState => {
              delete prevState.notifications[notification];
            });
          }
        }
        console.log('notifications after delete schedule', this.state.notifications);

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
            //end_date: '',
            end_date_time: '',
            location: '',
            //start_date: '',
            start_date_time: '',
            title: '',
            cityName: '',
            isTrackingWeather: false
          },
          events: events,
          currentEvent: false
        });
        // console.log(response);
      }.bind(this),
      error: function(err) {
        console.error(err);
      }.bind(this)
    })
  }

  //Updates the input field object for appointments in state
  updateNewAppointment(key, value) {
    this.setState((prevState) => {
      prevState.appointmentInput[key] = value;
      return {
        appointmentInput: prevState.appointmentInput
      }
    });
  }


  mergeDateTime(date, dateTime) {
    //console.log('date', date)
    //console.log('dateTime', dateTime)
    let dateSplit = date.split('/');
    let dateTimeSplit = dateTime.split(':');

    let res = new Date(dateSplit[0], dateSplit[1], dateSplit[2], dateTimeSplit[0], dateTimeSplit[1]);
    //console.log(res)
    return res
  }

  selectEvent(event) {
    //console.log('selecte event', event);
    //this.setState({currentEvent:event});
    //console.log(this.state.currentEvent);
    let isTracking = event.isTrackingWeather;

    //The database is storing the isTrackingWeather as string
      //but the checkbox expects a boolean
    if (typeof isTracking === 'string') {
      isTracking = (isTracking === 'true');
    }

    this.setState({
      newReminders: [],
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
        isTrackingWeather: isTracking
      },
      currentEvent: event.id
    });

    //Only shows the weather for appointments tracking the weather
    if (isTracking) {
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
          console.log('this.state.weather[i]', this.state.weather[i]);
          if (this.state.weather[i].location.name === event.cityName) {
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
        noOverlay: true,
      });
    }
  }

  getWeather(selectedCity) {
    var data = {
      city: selectedCity
    };

    $.ajax({
      url: '/allWeather',
      type: 'GET',
      data: data,
      dataType: 'json',
      success: function(response) {
        this.setState(() => {
          //find the selected city in the map data
          var forecastday = [];

          for (var i = 0; i < response.length; i++) {
            if (response[i].location.name === selectedCity) {
              forecastday = response[i].forecast.forecastday;
              break;
            }
          }
          //console.log('forecastday', forecastday);
          //console.log('response', response);
          return {
            selectedCity: selectedCity,
            forecastday: forecastday,
            weather: response
          };
        });
      }.bind(this),
      error: function(err) {
        console.error(err);
      }.bind(this)
    });
  }

  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: '/profile',
      success: function(userInfo) {
        this.setState({profileInformation: userInfo})
        //console.log("STATE ", this.state.profileInformation[0].name)
      }.bind(this),
      error: function(err) {
        console.error('Error in getting user information', err);
      }.bind(this)
    });

    $.ajax({
      type: 'GET',
      url: '/schedule',
      success: function(appointments) {
        // console.log(appointments);
        let events = [];
        let notifications = {};
        //console.log(events)
        appointments.map((appointment, i) => {
          let start;
          let end;

          /*if (appointment.start_date_time.length !== 0) {
            start = this.mergeDateTime(appointment.start_date, appointment.start_date_time);
            end = this.mergeDateTime(appointment.end_date, appointment.end_date_time);
          } else {*/
            start = new Date(appointment.start_date_time);
            end = new Date(appointment.end_date_time);
            // console.log('start', start);
            // console.log('notification', notification);
            if(appointment.reminders.length > 0) {
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

          //}
          events.push({
            title: appointment.title,
            start: start,
            end: end,
            description: appointment.description,
            location: appointment.location,
            id: appointment.id,
            cityName: appointment.cityName,
            isTrackingWeather: appointment.isTrackingWeather
          })
        })
        // console.log(events)
        this.setState({events: events});
        this.setState({notifications: notifications});
        console.log('notifications state at mount', notifications);
      }.bind(this),
      error: function(err) {
        console.error('Error in getting appointments', error);
      }.bind(this)
    });

    let startTickingForNotification = setInterval(() => {
      let currentTime = '' + new Date();

      if(this.state.notifications[currentTime]) {
        let currentNotification = this.state.notifications[currentTime];
        let title = currentNotification.appointmentTitle;
        let minutes = currentNotification.minutes;
        this.browserNotify(title, minutes);
      }
    }, 1000);

    // setTimeout(() => {
    // this.browserNotify('Test notification', 10);
    // }, 3000);
    $.ajax({
      url: '/allWeather',
      type: 'GET',
      dataType: 'json',
      success: function(response) {
        this.setState({
          weather: response
        });
      }.bind(this),
      error: function(err) {
        console.error(err);
      }.bind(this)
    });
  }

  browserNotify(body, minutes) {
    console.log('browserNotify invoked');
    document.getElementById('notification-sound').play();
    // react notification package: https://www.npmjs.com/package/react-web-notification
    // sound example: https://github.com/georgeOsdDev/react-web-notification/tree/develop/example
    Push.create('Reminder!', {
      body: minutes + ' minutes remaining for ' + body,
      icon: './images/alarm-3.png',
      timeout: 50000,               // Timeout before notification closes automatically.
      vibrate: [100, 100, 100],    // An array of vibration pulses for mobile devices.
      onClick: function() {
          // Callback for when the notification is clicked.
          window.focus(); this.close();
          // console.log(this);
      }
    });
  }

  // createUserProfile() {
  //   console.log('createUserProfile');
  // }

  render() {
    //console.log(this.state)
    $('.calendar-box').height($(window).height() - 50)
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
         ></Navbar>

        <div className='calendar-box'>
          <Calendar events={this.state.events} selectEvent={this.selectEvent} currentEvent={this.state.currentEvent}/>
        </div>
        <audio id="notification-sound" preload="auto">
          <source src='./sounds/Metal-ding-sound-effect.mp3' type='audio/mpeg' />
          <embed hidden='true' autoPlay='false' loop='false' src='./sounds/Metal-ding-sound-effect.mp3' />
        </audio>
      </div>
    );
  }
}
