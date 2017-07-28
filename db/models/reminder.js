const db = require('../config.js');
const Appointment = require('./appointment.js');

const Reminder = db.Model.extend({
  tableName: 'reminders',
  appointments: function() {
    return this.belongsTo(Appointment);
  }
});

module.exports = Reminder;