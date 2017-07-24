require('dotenv').config();
const weatherApiKey = process.env.APIXU_KEY;

const path = require('path');
const fs = require('fs');
const request = require('request');
// const cities = require('');
const dataFile = path.join(__dirname, '../weather/weatherData.json');

getWeatherData = (city, callback) => {
  let url = `http://api.apixu.com/v1/forecast.json?key=${weatherApiKey}&q=${city}`
  request(url, (err, res, body) => {
    callback(body);
  });
};

exports.updateWeatherData = (cities) => {
  fs.writeFile(dataFile, '', () => {
    console.log('dataFile cleared');
    let allData = [];
    let dataProcessed = 0;
    cities.forEach((city, index, arr) => {
      getWeatherData(city, (data) => {
        allData.push(data);
        dataProcessed++;
        if(dataProcessed === arr.length) {
          fs.appendFile(dataFile, allData, (err) => {
            if(err) {
              console.log('Error in writing file', err);
              throw err;
            } else {
              console.log('Data written in dataFile');
              // console.log(allData);
            }
          });
        }
      });
    });
  });
};