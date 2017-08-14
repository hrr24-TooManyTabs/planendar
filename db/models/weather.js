const db = require('../config.js');

const Weather = db.Model.extend({
  tableName: 'weathers'
});

module.exports = Weather;