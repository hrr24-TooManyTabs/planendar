require('dotenv').config();
const weatherApiKey = process.env.APIXU_KEY;

const path = require('path');
const fs = require('fs');
const request = require('request');
// const cities = require('');
const dataFile = path.join(__dirname, '../weather/weatherData.txt');

getWeatherData = (city, callback) => {
  let url = `http://api.apixu.com/v1/forecast.json?key=${weatherApiKey}&q=${city}`
  request(url, (err, res, body) => {
    callback(body);
  });
};

exports.updateWeatherData = (cities) => {
  fs.writeFile(dataFile, '', () => {
    cities.forEach((city) => {
      getWeatherData(city, (data) => {
        fs.appendFile(dataFile, data, (err) => {
          if(err) {
            console.log('Error in writing file', err);
            throw err;
          }
        });
        // console.log('-------------------------------------');
        // console.log('Data for ', city, '\n', data);
      });
    });
  });
};