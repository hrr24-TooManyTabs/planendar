const db = require('../config.js');
const Reminder = require('./reminder.js');

const Appointment = db.Model.extend({
  tableName: 'appointments',
  reminders: function() {
    return this.hasMany(Reminder);
  }
});

module.exports = Appointment;