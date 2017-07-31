const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const bookshelf = require('bookshelf');
const knex = require('knex');
const nodemailer = require('nodemailer');

const db = require('../db/config.js');
const User = require('../db/models/user.js');
const Appointment = require('../db/models/appointment.js');
const Reminder = require('../db/models/reminder.js');
const Reminders= require('../db/collections/reminders.js');

const weatherHelper = require('./weather-helper.js');

const requestHandler = {};

function error (err) {
  console.error(err);
  res.sendStatus(500);
}

function regenerate (req, res, user) {
  req.session.regenerate((err) => {
    if (err) {
      error(err);
    } else {
      // console.log('session regenerated');
      req.session.user = user;
      delete req.session.user.password;
      res.redirect('/');
    }
  })
}

requestHandler.changeColor = function (req, res) {
  console.log(req.body.schemes);
  res.end();
}


this.recipientID;

requestHandler.getRecipientInfo = function (recipientEmail) {
  new User({email: recipientEmail})
                .fetch()
                .then(user => {
                // console.log("USER INFO ", user.attributes.id);
                this.recipientID = user.attributes.id;
                console.log('from getRecipientInfo -> ', this.recipientID);
    })
}



requestHandler.getSignup = function (req, res) {
  res.render('signup');
};

requestHandler.displayProfile = function (req, res) {
  console.log(req.session.user.color)
  res.render('editProfile', {'photo': req.session.user.photo || "https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg", 'color': (req.session.user.color)});
};

requestHandler.editProfile = function (req, res) {
  var prevColor = req.session.user.color;
  if (req.body.scheme !== 'current') {
    req.session.user.color = req.body.scheme;
  }else if (req.body.scheme === 'current') {
    req.session.user.color = prevColor;
  }else if(req.body.scheme === 'default'){
    req.session.user.color = ''
  }

  if (req.body.photo) {
    req.session.user.photo = req.body.photo;
  }else if(!req.body.photo){
    req.session.user.photo = req.session.user.photo;
  }else{
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
  .then(function (model) {
    res.end(model);
  })

};

requestHandler.getColor = function (req, res) {
  if (req.session.user.color === '#00a80b') {
    var colorArray = ['#00a80b', '#00cc0d', '#95d69a'];
  } else if (req.session.user.color === '#ed1212') {
    var colorArray = ['#ed1212', '#ff0000'];
  } else if (req.session.user.color === '#ffae00') {
    var colorArray = ['#ffae00', '#f9a22f'];
  } else if (req.session.user.color === 'default') {
    var value = '#ffae00';
  }
  res.send(colorArray);
}

requestHandler.sendAppointment = function (req, res) {
  if (!req.body){
    return res.sendStatus(400)
  }
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'planendar.host@gmail.com',
        pass: 'planendar_admin'
      }
    })

    this.recipient = req.body.user_id;
    let emailMessage = req.session.user.name + ' has shared the following appointment with you via Planendar!' +
      '\n\n' +
      'Appointment: ' + req.body.title +
      '\nDate: ' + req.body.start_date +
      '\nStart Time: ' + req.body.start_date_time + ' (24hr time)' +
      '\nEnd Time: ' + req.body.end_date_time + ' (24hr time)' +
      '\nLocation: ' + req.body.location;

    let HelperOptions = {
      from: '"Planendar" <andrewandrewforesiforesi@gmail.com',
      to: req.body.user_id,
      subject: req.session.user.name + ' has shared an appointment with you!',
      text: emailMessage
    };

    transporter.sendMail(HelperOptions, (error, info) => {
      if(error){
        console.log(error)
      }else{
        new User({email: this.recipient})
          .fetch()
          .then(user => {
          this.recipientID = user.attributes.id;
          let newAppointmentData = req.body;
          newAppointmentData.user_id = this.recipientID;

          new Appointment(newAppointmentData)
          .save()
          .then(appointment => {

          })
    })
    .catch(err => {
      res.status(500).send('server error');
    });
  }
  res.end()
})


}


requestHandler.getAllUsers = function (req, res) {
  new User({})
    .fetchAll()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).send('server error');
    });
}

requestHandler.getAllReminders = function (req, res) {
  Reminder.fetchAll().then(reminders => res.json(reminders)).catch(err => error(err));
}

requestHandler.getAllSchedules = function (req, res) {
  Appointment.forge().orderBy('start_date_time', 'DESC').fetchAll().then(appointments => res.json(appointments)).catch(err => error(err));
}

requestHandler.getAllWeather = function (req, res) {
  let dataFile = path.join(__dirname, '../weather/weatherData.txt');
  fs.readFile(dataFile, (err, data) => {
    console.log('data', data.length);
    if(err) {
      console.log('Error in getting weatherData', err);
      res.status(500).send('Error in server');
    } else if(data.length > 0) {
      // console.log('Read data', JSON.parse(data));
      let jsonData = JSON.parse(data);
      res.json(jsonData);
    } else {
      res.send('No weather data yet');
    }
  });
}

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
  }
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
      })
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
        .catch((err) => {
          if (err) {
            error(err);
          }
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
      .then((user) => {
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
      })
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
    // console.log('user exists in session. logging in.');

    res.render('index');
  } else {
    // console.log('user does not exist in session. redirecting to login.');

    res.redirect('/login');
  }
};

requestHandler.getProfile = function (req, res) {

  User.where('id', req.session.user.id)
              .fetchAll()
              .then((userInfo) => {
                res.send(userInfo);
              })
              .catch((err) => {
                error(err);
              })



};

requestHandler.postProfile = function (req, res) {
  let email = req.body.email;
  User.where('email', email)
      .fetch()
      .then((user) => {
        res.sendStatus(201); //send profile
      })
      .catch((err) => {
        error(err);
      })

};

requestHandler.updateProfile = function (req, res) {
  res.sendStatus(201);
}

requestHandler.getSchedule = function (req, res) {
  new Appointment()
    .where('user_id', req.session.user.id)
    .fetchAll({
      withRelated: 'reminders'
    })
    .then((appointmentsWithReminders) => {
      // console.log('Appointments with reminders', appointmentsWithReminders);
      res.json(appointmentsWithReminders);
    })
    .catch((err) => {
      error(err);
    });

  // Appointment.where('user_id', req.session.user.id)
  //             .fetchAll()
  //             .then((appointments) => {
  //               res.send(appointments);
  //             })
  //             .catch((err) => {
  //               error(err);
  //             })
};

requestHandler.postSchedule = function (req, res) {
  console.log(req.body);
  // res.send('hello');
  // return;
  // let end_date = (req.body.end_date === '') ? req.body.start_date : req.body.end_date;

  let appointment = {
    title: req.body.title,
    description: req.body.description,
    // start_date: req.body.start_date,
    start_date_time: req.body.start_date_time,
    // end_date: end_date,
    end_date_time: req.body.end_date_time,
    location: req.body.location,
    cityName: req.body.cityName,
    isTrackingWeather: req.body.isTrackingWeather,
    user_id: req.session.user.id
    // user_id: 1
  };

  //console.log('appointment data before db ', appointment);

  new Appointment(appointment)
    .save()
    .then((newAppointment) => {
      if(req.body.reminders && req.body.reminders.length > 0) {
        if(req.body.cityName !== '') {
          weatherHelper.updateWeatherData();
        }

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
              .catch((err) => {
                error(err);
              });
          })
          .catch((err) => {
            error(err);
          });
      } else {
        res.send(newAppointment);
      }
    })
    .catch((err) => {
      error(err);
    });
};

requestHandler.updateSchedule = function (req, res) {
  // console.log('updateSchedule req body', req.body);
  // let end_date = (req.body.end_date === '') ? req.body.start_date : req.body.end_date;

  let appointmentData = {
    title: req.body.title,
    description: req.body.description,
    // start_date: req.body.start_date,
    start_date_time: req.body.start_date_time,
    // end_date: end_date,
    end_date_time: req.body.end_date_time,
    location: req.body.location,
    cityName: req.body.cityName,
    isTrackingWeather: req.body.isTrackingWeather,
    user_id: req.session.user.id
  };

  //console.log('appointment data before db ', appointmentData);

  Appointment
    .where({
      'user_id': req.session.user.id,
      'id': req.params.id
    })
    .fetch()
    .then(appointment => {
      // console.log('appointment before update', appointment);
      appointment.save(appointmentData, {patch: true})
        .then(updatedAppointment => {
          if(req.body.cityName !== '') {
            weatherHelper.updateWeatherData();
          }
          // console.log('appointment after update', updatedAppointment);
          appointmentId = appointment.get('id');
          // console.log('appointmentId after update', appointmentId);

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
                    // console.log('Reminders updated');
                    // console.log('appointmentId after updating reminders', appointmentId);
                    Reminder
                      .where('appointment_id', '=', appointmentId)
                      .fetchAll()
                      .then((updatedReminders) => {
                        updatedAppointment.attributes['reminders'] = updatedReminders;
                        res.send(updatedAppointment);
                      })
                      .catch((err) => {
                        error(err);
                      });
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



//get a specific user from the database
requestHandler.getUser = function (req, res) {
  new User({'email': recipient})
    .fetch()
    .then(user => {
      console.log(user);
      res.json(user);
    })
    .catch(err => {
      res.status(500).send('server error');
    });
};



requestHandler.deleteSchedule = function (req, res) {
  Appointment
    .where({
      'user_id': req.session.user.id,
      'id': req.params.id
    })
    .fetch()
    .then(appointment => {
      // console.log('deleted appointment id', appointment.get('id'));
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

// requestHandler.checkUserEmail = function(req, res) {
//   new User({email: req.body.user_id})
//   .fetch()
//   .then(user => {
//     console.log('HERE IS THE USER ', user);
//   })
// }

module.exports = requestHandler;
