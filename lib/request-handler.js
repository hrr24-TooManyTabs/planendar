"use strict";
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const bookshelf = require('bookshelf');
const knex = require('knex');
const db = require('../db/config.js')
const User = db.Model.extend({
  tableName: 'users'
});
const Appointment = db.Model.extend({
  tableName: 'appointments'
});
const Reminder = db.Model.extend({
  tableName: 'reminders'
});
const Reminders = db.Collection.extend({
  model: Reminder
});
// Reminders.model = Reminder;

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

requestHandler.getSignup = function (req, res) {
  res.render('signup');
};

requestHandler.displayProfile = function (req, res) {
  res.render('editProfile');
};

requestHandler.editProfile = function (req, res) {
  let photo = req.body.photo || "https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg";
  let name = req.body.name || req.session.user.name;
  let email = req.body.email || req.session.user.email;
  console.log(req.session.user.name)
  res.render('login');
  let userInfo = {
    id: req.session.user.id,
    name: name,
    email: email,
    photo: photo
  };

  new User(userInfo)
  .save()
  .then(function (model) {
    res.end(model);
  })

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
}

requestHandler.postSignup = function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let user = {
    name: name,
    email: email,
    password: password
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
  Appointment.where('user_id', req.session.user.id)
              .fetchAll()
              .then((appointments) => {
                res.send(appointments);
              })
              .catch((err) => {
                error(err);
              })
};

requestHandler.postSchedule = function (req, res) {
  // console.log('postSchedule req body ', req.body);
  // console.log('User id in postSchedule', req.session.user.id);
  /*
  Received data:
  {
  description: "some description"
  end_date: "2017-07-19"
  end_date_time: "02:00"
  location: "Dhaka"
  start_date: "2017-07-19"
  start_date_time: "01:00"
  title: "kdkdk",
  reminders: [ '5', '10', '30' ]
  }
  */
  let appointment = {
    title: req.body.title,
    description: req.body.description,
    start_date: req.body.start_date,
    start_date_time: req.body.start_date_time,
    end_date: req.body.end_date,
    end_date_time: req.body.end_date_time,
    location: req.body.location,
    user_id: req.session.user.id
  };

  new Appointment(appointment)
    .save()
    .then((newAppointment) => {
      // console.log('newAppointment', newAppointment);
      newAppointmentId = newAppointment.get('id');
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
          // console.log('newAppointmentId', newAppointmentId);
          // new Reminder({'appointment_id': newAppointmentId})
          Reminder
            // .query({where: {appointment_id: newAppointmentId}})
            .where('appointment_id', '=', newAppointmentId)
            .fetchAll()
            .then((savedReminders) => {
              // console.log('savedReminders', JSON.stringify(savedReminders));
              newAppointment.attributes['reminders'] = savedReminders;
              // newAppointment.attributes['hello'] = 'Hello World';
              console.log('newAppointment', newAppointment);
              res.send(newAppointment);
            })
            .catch((err) => {
              error(err);
            });
        })
        .catch((err) => {
          error(err);
        });
        // .then((savedReminders) => {
        //   console.log(savedReminders);
        // })
        // .then(() => {
        //   res.send(newAppointment);
        // });

    })
    .catch((err) => {
      error(err);
    })
};

requestHandler.updateSchedule = function (req, res) {
  new Appointment(req.body).save()
      .then((newAppointment) => {
        res.send(newAppointment);
      })
      .catch((err) => {
        error(err);
      })
};



module.exports = requestHandler;
