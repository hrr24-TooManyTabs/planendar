require('dotenv').config();
const weatherApiKey = process.env.APIXU_KEY;

const path = require('path');
const fs = require('fs');
const request = require('request');

const db = require('../db/config.js');
const Appointment = require('../db/models/appointment.js');

const dataFile = path.join(__dirname, '../weather/weatherData.txt');

getWeatherData = (city, callback) => {
  let url = `http://api.apixu.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=${10}`
  request(url, (err, res, body) => {
    callback(body);
  });
};

checkIfWeatherDataFileIsEmpty = (callback) => {
  fs.readFile(dataFile, (err, data) => {
    if(err) {
      console.log('Error in getting weatherData', err);
      callback(err);
    } else if(data.length > 0) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addNewCityWeatherData = (city) => {
  getCurrentCities(cities => {
    if(!cities.includes(city)) {
      checkIfWeatherDataFileIsEmpty(result => {
        if(result === true) {
          console.log('Has weather data');
        } else {
          console.log('No weather data');
        }
      });
    } else {
      console.log('Has data??');
    }
  });
};

getCurrentCities = (callback) => {
  Appointment
    .where('cityName', '<>', '')
    .where('isTrackingWeather', 'true')
    .fetchAll({
      columns: 'cityName'
    })
    .then(citiesData => {
      return citiesData.reduce((cities, cityData) => {
        if(!cities.includes(cityData.attributes.cityName)) {
          cities.push(cityData.attributes.cityName);
        }
        return cities;
      }, []);
    })
    .then(cities => callback(cities));
};

exports.updateWeatherData = () => {
  getCurrentCities(cities => {
    fs.writeFile(dataFile, '', () => {
      // console.log('dataFile cleared');
      // console.log('cities found from db', JSON.stringify(cities));
      let allData = [];
      let dataProcessed = 0;
      cities.forEach((city, index, arr) => {
        getWeatherData(city, (data) => {
          allData.push(data);
          dataProcessed++;
          if(dataProcessed === arr.length) {
            allData = '[' + allData + ']';
            fs.appendFile(dataFile, allData, (err) => {
              if(err) {
                console.log('Error in writing file', err);
                throw err;
              } else {
                // console.log('Data written in dataFile');
              }
            });
          }
        });
      });
    });
  });
};

