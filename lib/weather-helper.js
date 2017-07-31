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
    // .then(cities => console.log('cities array', cities));
    .then(cities => callback(cities));
  // callback(cities);
};

exports.updateWeatherData = () => {
  getCurrentCities(cities => {
    fs.writeFile(dataFile, '', () => {
      console.log('dataFile cleared');
      console.log('cities found from db', JSON.stringify(cities));
      let allData = [];
      let dataProcessed = 0;
      cities.forEach((city, index, arr) => {
        // console.log('city', city);
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
                console.log('Data written in dataFile');
                // console.log(allData);
              }
            });
          }
        });
      });
    });

    // currentCities.forEach((city) => {
    //   console.log('city', city);
    // })
    // console.log('currentCities', JSON.stringify(currentCities));
  });
};
