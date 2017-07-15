const path = require('path');
const bcryt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const bookshelf = require('bookshelf');
const knex = require('knex');
const db = require('../db/config.js')
const User = db.Model.extend({
  tablename: 'users'
})
const Appointments = db.Model.extend({
  tablename: 'appointments'
})
const reminders = db.Model.extend({
  tablename: 'reminders'
})

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
      console.log('session regenerated');
      req.session.user = user;
      delete req.session.user.password;
      res.redirect('/');
    }
  })
}

requestHandler.getSignup = function (req, res) {
  res.render('signup');
};

requestHandler.postSignup = function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let user = {
    username: username,
    password: password
  }
  User.where('username', username)
      .fetch()
      .then((user) => {
        if (user) {
          console.log('Username already in use');
          res.redirect('/signup');
        } else {
          if (username === password) {
            console.log('Password should not match username');
            res.redirect('/signup');
          } else if (password === '') {
            console.log('Password should not be an empty string');
            res.redirect('/signup');
          } else {
            createUser(req, res, user)
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
      user.password = hash;
      new User (user).save()
        .then((user) => {
          regenerate(req, res, user);
        })
        .catch((err) => {
          if (err) {
            error(err);
          }
        })
    });
};

requestHandler.getLogin = function (req, res) {
  res.render('login');
};

requestHandler.postLogin = function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  User.where('username', username)
      .fetch()
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, (err, authenticated) => {
            if (err) {
              error(err)
            } else if (authenticated) {
              regenerate(req, res, user)
            } else {
              res.redirect('/login')
            }
          })
        } else {
          res.redirect('/signup');
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
    console.log('user exists in session. logging in.');

    res.render('index');
  } else {
    console.log('user does not exist in session. redirecting to login.');

    res.redirect('/login');
  }
};

requestHandler.getProfile = function (req, res) {
  let username = req.body.username;
  User.where('username', username)
      .fetch()
      .then((user) => {
        res.sendStatus(200); //send profile data
      })
      .catch((err) => {
        error(err);
      })
};

requestHandler.postProfile = function (req, res) {
  let username = req.body.username;
  User.where('username', username)
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
  Appointments.where('id', req.session.user.id)
              .fetchAll()
              .then((appointments) => {
                res.send(appointments);
              })
              .catch((err) => {
                error(err);
              })
};

requestHandler.postSchedule = function (req, res) {
  let appointment = {
    title: req.body.title,
    description: req.body.description,
    start_date: req.body.startDate,
    start_date_time: req.body.startTime,
    end_date: req.body.endDate,
    end_date_time: req.body.endTime,
    user_id: req.session.user.id
  }
  new Appointments(appointment).save()
    .then((newAppointment) => {
      res.send(newAppointment);
    })
    .catch((err) => {
      error(err);
    })
};

requestHandler.updateSchedule = function (req, res) {
  new Appointments(req.body).save()
      .then((newAppointment) => {
        res.send(newAppointment);
      })
      .catch((err) => {
        error(err);
      })
};



module.exports = requestHandler;
