const db = require('../config.js');
const Reminder = require('../models/reminder.js');

const Reminders = db.Collection.extend({
  model: Reminder
});

module.exports = Reminders;