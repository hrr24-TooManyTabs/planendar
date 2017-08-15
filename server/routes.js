const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const partials = require('express-partials');
const db = require('../db/config.js');
const requestHandler = require('../lib/request-handler.js');

const weatherHelper = require('../lib/weather-helper.js');

// weatherHelper.updateAllWeatherData();
const threeHours = 3 * 60 * 60 * 1000;
setInterval(() => {
  weatherHelper.updateAllWeatherData();
}, threeHours);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(session({
  secret: 'agdiyhabdiwabhidwadias',
  resave: false,
  saveUninitialized: true,
}));

app.get('/signup', requestHandler.getSignup);
app.post('/signup', requestHandler.postSignup);
app.get('/login', requestHandler.getLogin);
app.post('/login', requestHandler.postLogin);
app.get('/logout', requestHandler.logout);

app.get('/editProfile', requestHandler.displayProfile);
app.post('/editProfile', requestHandler.editProfile);

app.get('/colorScheme', requestHandler.getColor);
app.post('/colorScheme', requestHandler.changeColor);

app.post('/sendAppointment', requestHandler.sendAppointment);

app.use(cors());

app.get('/', requestHandler.index);

app.get('/profile', requestHandler.getProfile);
app.post('/profile', requestHandler.postProfile);
app.put('/profile', requestHandler.updateProfile);

app.get('/schedule', requestHandler.getSchedule);
app.post('/schedule', requestHandler.postSchedule);
app.put('/schedule/:id', requestHandler.updateSchedule);
app.delete('/schedule/:id', requestHandler.deleteSchedule);

app.get('/allweather', requestHandler.getAllWeather);
app.get('/summary/:startDateTime/:endDateTime', requestHandler.getSummary);

app.get('/confirmAppointmentPage/:userid/:apntid', requestHandler.confirmAppointmentPage);

// The followings are created for testing purposes
// app.get('/users', requestHandler.getAllUsers);
// app.get('/reminders', requestHandler.getAllReminders);
// app.get('/allschedules', requestHandler.getAllSchedules);

app.use(express.static(path.join(__dirname, '/../public')));

module.exports = app;
