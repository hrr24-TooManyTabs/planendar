const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const bookshelf = require('bookshelf');
const knex = require('knex');
const nodemailer = require('nodemailer');
const moment = require('moment');

const db = require('../db/config.js');
const User = require('../db/models/user.js');
const Appointment = require('../db/models/appointment.js');
const Reminder = require('../db/models/reminder.js');
const Weather = require('../db/models/weather.js');
const Reminders= require('../db/collections/reminders.js');

const weatherHelper = require('./weather-helper.js');

const requestHandler = {};

function error (err) {
  console.error(err);
  res.status(500).send('server error');
}

function regenerate (req, res, user) {
  req.session.regenerate((err) => {
    if (err) {
      error(err);
    } else {
      req.session.user = user;
      delete req.session.user.password;
      res.redirect('/');
    }
  })
}

requestHandler.getSummary = function (req, res) {
  let summaryStartDateTime = req.params.startDateTime;
  let summaryEndDateTime = req.params.endDateTime;
  let userId = req.session.user.id;

  new Appointment()
    .query((qb) => {
      qb.where('user_id', userId)
    })
    .query((qb) => {
      qb.whereBetween('start_date_time', [summaryStartDateTime, summaryEndDateTime])
    })
    .fetchAll({
      columns: ['start_date_time', 'end_date_time', 'tag']
    })
    .then(appointments => {
      let summary = {};
      appointments.forEach(appointment => {
        let tag = appointment.attributes.tag;
        let start = moment(new Date(appointment.attributes.start_date_time));
        let end = moment(new Date(appointment.attributes.end_date_time));

        // console.log('START ',start);
        // console.log('END ', end);
        let diff = moment.duration(end.diff(start));
        let diffInMins = diff.asMinutes();

        if(tag === '') {
          tag = 'Other';
        }

        if(summary[tag]) {
          summary[tag] += diffInMins;
        } else {
          summary[tag] = diffInMins;
        }
      });

      for(let tag in summary) {
        let durationInMinutes = summary[tag];
        let hours = Math.floor(durationInMinutes/60);
        let minutes = durationInMinutes % 60;
        let hoursString;
        let minutesString;

        if(hours === 0) {
          hoursString = '';
        } else if(hours === 1) {
          hoursString = hours + ' hour ';
        } else {
          hoursString = hours + ' hours ';
        }

        if(minutes === 0) {
          minutesString = '';
        } else if(minutes === 1) {
          minutesString = minutes + ' minute ';
        } else {
          minutesString = minutes + ' minutes ';
        }

        summary[tag] = hoursString+ minutesString;
      }

      res.json(summary);
    })
    .catch(err=> {
      error(err);
    });
};

this.recipientID;

requestHandler.getRecipientInfo = function (recipientEmail) {
  new User({email: recipientEmail})
    .fetch()
    .then(user => {
      this.recipientID = user.attributes.id;
      // console.log('from getRecipientInfo -> ', this.recipientID);
    });
};

requestHandler.getSignup = function (req, res) {
  res.render('signup');
};

requestHandler.displayProfile = function (req, res) {
  res.render('editProfile', {
    'photo': req.session.user.photo || "https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg",
    'color': (req.session.user.color),
    'email': req.session.user.email,
    'name': req.session.user.name
  });
};

requestHandler.editProfile = function (req, res) {
  var prevColor = req.session.user.color;

  if (req.body.scheme !== 'current') {
    req.session.user.color = req.body.scheme;
  } else if (req.body.scheme === 'current') {
    req.session.user.color = prevColor;
  } else if(req.body.scheme === 'default') {
    req.session.user.color = '';
  }

  if (req.body.photo) {
    req.session.user.photo = req.body.photo;
  } else if (!req.body.photo) {
    req.session.user.photo = req.session.user.photo;
  } else {
    req.session.user.photo = "https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg"
  }

  let name = req.body.name || req.session.user.name;
  let email = req.body.email || req.session.user.email;
  let color = req.session.user.color;

  res.render('login');

  let userInfo = {
    id: req.session.user.id,
    name: name,
    email: email,
    photo: req.session.user.photo,
    color: color
  };

  new User(userInfo)
  .save()
  .then(model => {
    res.end(model);
  });
};

requestHandler.getColor = function (req, res) {
  let colorArray;
  if (req.session.user.color === '#00a80b') {
    colorArray = ['#00a80b', '#00cc0d', '#95d69a'];
  } else if (req.session.user.color === '#ed1212') {
    colorArray = ['#ed1212', '#ff0000'];
  } else if (req.session.user.color === '#ffae00') {
    colorArray = ['#ffae00', '#f9a22f'];
  } else if (req.session.user.color === 'default') {
    value = '#ffae00';
  }

  res.send(colorArray);
};

requestHandler.changeColor = function (req, res) {
  // console.log(req.body.schemes);
  res.end();
}

requestHandler.sendAppointment = function (req, res) {
  this.recipient = req.body.user_id;

  new User({email: this.recipient})
    .fetch()
    .then(user => {
      this.recipientID = user.attributes.id;
      this.newAppointmentData = req.body;
      this.newAppointmentData.user_id = this.recipientID;
      this.newAppointmentData.approved = 0;
      this.newAppointmentData.shared_by = req.session.user.name;

      new Appointment(this.newAppointmentData)
      .save()
      .then(appointment => {
        this.sentAppointmentId = appointment.attributes.id;

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'planendar.host@gmail.com',
            pass: 'planendar_admin'
          }
        });

        let link = "http://localhost:8080/confirmAppointmentPage/:" + req.session.user.id + '/:' + this.sentAppointmentId;
        let message =  `<a href=${link}>HERE</a>`;

        let emailMessage = req.session.user.name + ' has shared the following appointment with you via Planendar!' +
          '\n\n' +
          'Appointment: ' + req.body.title +
          '\nStart Time: ' + req.body.start_date_time + ' (24hr time)' +
          '\nEnd Time: ' + req.body.end_date_time + ' (24hr time)' +
          '\nLocation: ' + req.body.location +
          '\nDescription: ' + req.body.description +
          '\nClick here to confirm: ' + link;

        let HelperOptions = {
          from: '"Planendar" <planendar.host@gmail.com',
          to: this.recipient,
          subject: req.session.user.name + ' has shared an appointment with you!',
          text: emailMessage,
        };

        transporter.sendMail(HelperOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          res.end();
        });

        res.sendStatus(200);
        res.end();
      });
    }).catch(err => {
      error(err);
    });
};

requestHandler.getAllUsers = function (req, res) {
  new User({})
    .fetchAll()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).send('server error');
    });
};

requestHandler.getAllReminders = function (req, res) {
  Reminder
    .fetchAll()
    .then(reminders => res.json(reminders))
    .catch(err => error(err));
};

requestHandler.getAllSchedules = function (req, res) {
  Appointment
    .forge()
    .orderBy('start_date_time', 'DESC')
    .fetchAll()
    .then(appointments => res.json(appointments))
    .catch(err => error(err));
};

requestHandler.getAllWeather = function (req, res) {
  Weather
    .fetchAll({
      columns: 'weatherData'
    })
    .then(data => {
      weatherData = data.map(currentData => {
        return JSON.parse(currentData.attributes['weatherData']);
      });
      res.json(weatherData);
    })
    .catch(err => error(err));
};

requestHandler.postSignup = function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let color = 'default';
  let user = {
    name: name,
    email: email,
    password: password,
    color: color
  };

  new User({email: email})
    .fetch()
    .then((existingUser) => {
      if (existingUser) {
        console.log('Email already in use');
        res.redirect('/signup');
      } else {
        if (email === password) {
          console.log('Password should not match email');
          res.redirect('/signup');
        } else if (password === '') {
          console.log('Password should not be an empty string');
          res.redirect('/signup');
        } else {
          createUser(req, res, user);
        }
      }
    })
    .catch((err) => {
      if (err) {
        error(err);
      }
    });
};

function createUser (req, res, user) {
  const cipher = Promise.promisify(bcrypt.hash);
  cipher(user.password, null, null)
    .then((hash) => {
      let newUser = new User({
        name: user.name,
        email: user.email,
        color: user.color,
        password: hash
      });

      newUser.save()
        .then((newUser) => {
          regenerate(req, res, newUser);
        })
        .catch(err => {
          error(err);
        });
    });
};

requestHandler.getLogin = function (req, res) {
  res.render('login');
};

requestHandler.postLogin = function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  new User({email: email})
    .fetch()
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.get('password'), (err, authenticated) => {
          if (err) {
            error(err);
          } else if (authenticated) {
            regenerate(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      } else {
        res.redirect('/login');
      }
    });
};

requestHandler.logout = function (req, res) {
  req.session.destroy(err => {
    if (err) {
      error(err);
    } else {
      res.redirect('/login')
    }
  });
};

requestHandler.index = function (req, res) {
  if (req.session ? !!req.session.user : false) {
    res.render('index');
  } else {
    res.redirect('/login');
  }
};

requestHandler.getProfile = function (req, res) {
  User.where('id', req.session.user.id)
    .fetchAll()
    .then(userInfo => {
      res.send(userInfo);
    })
    .catch(err => {
      error(err);
    });
};

requestHandler.postProfile = function (req, res) {
  let email = req.body.email;
  User.where('email', email)
    .fetch()
    .then((user) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      error(err);
    });
};

requestHandler.updateProfile = function (req, res) {
  res.sendStatus(201);
};

requestHandler.getSchedule = function (req, res) {
  new Appointment()
    .where('user_id', req.session.user.id)
    .fetchAll({
      withRelated: 'reminders'
    })
    .then((appointmentsWithReminders) => {
      res.json(appointmentsWithReminders);
    })
    .catch((err) => {
      error(err);
    });
};

requestHandler.postSchedule = function (req, res) {
  let appointment = {
    title: req.body.title,
    description: req.body.description,
    start_date_time: req.body.start_date_time,
    end_date_time: req.body.end_date_time,
    location: req.body.location,
    cityName: req.body.cityName,
    isTrackingWeather: req.body.isTrackingWeather,
    tag: req.body.tag,
    user_id: req.session.user.id
  };

  new Appointment(appointment)
    .save()
    .then(newAppointment => {
      if(req.body.cityName && req.body.cityName !== '') {
        weatherHelper.addNewCityWeatherData(req.body.cityName);
      }

      if(req.body.reminders && req.body.reminders.length > 0) {
        let newAppointmentId = newAppointment.get('id');
        let reminderData = [];
        req.body.reminders.forEach((reminder) => {
          reminderData.push({
            'appointment_id': newAppointmentId,
            'minutes': reminder
          });
        });

        let reminders = Reminders.forge(reminderData);

        Promise.all(reminders.invokeThen('save'))
          .then(() => {
            Reminder
              .where('appointment_id', '=', newAppointmentId)
              .fetchAll()
              .then((savedReminders) => {
                newAppointment.attributes['reminders'] = savedReminders;
                res.send(newAppointment);
              })
              .catch(err => {
                error(err);
              });
          })
          .catch(err => {
            error(err);
          });
      } else {
        res.send(newAppointment);
      }
    })
    .catch(err => {
      error(err);
    });
};

function respondAfterAddingWeatherData(cityName, res, appointment) {
  weatherHelper.addNewCityWeatherData(cityName, (weatherData) => {
    res.send(appointment);
  });
}

requestHandler.updateSchedule = function (req, res) {
  let appointmentData = {
    title: req.body.title,
    description: req.body.description,
    start_date_time: req.body.start_date_time,
    end_date_time: req.body.end_date_time,
    location: req.body.location,
    cityName: req.body.cityName,
    isTrackingWeather: req.body.isTrackingWeather,
    tag: req.body.tag,
    user_id: req.session.user.id
  };

  Appointment
    .where({
      'user_id': req.session.user.id,
      'id': req.params.id
    })
    .fetch()
    .then(appointment => {
      appointment.save(appointmentData, {patch: true})
        .then(updatedAppointment => {
          if(req.body.cityName && req.body.cityName !== '') {
            weatherHelper.addNewCityWeatherData(req.body.cityName);
          }
          appointmentId = appointment.get('id');

          Reminder
            .where('appointment_id', appointmentId)
            .destroy()
            .then(() => {
              if(req.body.reminders) {
                let reminderData = [];
                req.body.reminders.forEach((reminder) => {
                  reminderData.push({
                    'appointment_id': appointmentId,
                    'minutes': reminder
                  });
                });

                let reminders = Reminders.forge(reminderData);

                Promise.all(reminders.invokeThen('save'))
                  .then(() => {
                    Reminder
                      .where('appointment_id', '=', appointmentId)
                      .fetchAll()
                      .then((updatedReminders) => {
                        updatedAppointment.attributes['reminders'] = updatedReminders;
                        res.send(updatedAppointment);
                      })
                      .catch(err => error(err));
                  })
                  .catch(err => error(err));
              } else {
                res.send(updatedAppointment);
              }
            });
        })
        .catch(err => error(err));
    });
};

requestHandler.getUser = function (req, res) {
  new User({'email': recipient})
    .fetch()
    .then(user => res.json(user))
    .catch(err => error(err));
};

requestHandler.deleteSchedule = function (req, res) {
  Appointment
    .where({
      'user_id': req.session.user.id,
      'id': req.params.id
    })
    .fetch()
    .then(appointment => {
      Reminder
        .where('appointment_id', appointment.get('id'))
        .destroy()
        .then(() => {
          appointment.destroy();
          res.status(200).send();
        })
        .catch(err => error(err));
    })
    .catch(err => error(err));
};

requestHandler.confirmAppointmentPage = function (req, res) {
  this.currentApntId = (req.params.apntid).slice(1);

  new Appointment()
    .where('id', this.currentApntId)
    .fetch()
    .then( appointment => {
      this.currentApntInfo = appointment.attributes;
      this.currentApntInfo.cityName = '';
      this.currentApntInfo.isTrackingWeather = '';
      res.render('confirmAppointment', {
        'title': this.currentApntInfo.title,
        'description': this.currentApntInfo.description,
        'start': this.currentApntInfo.start_date_time,
        'end': this.currentApntInfo.end_date_time,
        'location': this.currentApntInfo.location,
        'shared': this.currentApntInfo.shared_by
      });

      new Appointment(this.currentApntInfo)
      .save({approved: 1})
      .then( newAppointment => {
      }).catch(err => error(err));
    })
    .catch(err => error(err));
}

module.exports = requestHandler;
