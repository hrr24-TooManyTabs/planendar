require('dotenv').config();
const weatherApiKey = process.env.APIXU_KEY;

const path = require('path');
const fs = require('fs');
const request = require('request');

const db = require('../db/config.js');
const Appointment = require('../db/models/appointment.js');
const Weather = require('../db/models/weather.js');

const dataFile = path.join(__dirname, '../weather/weatherData.txt');

getWeatherData = (city, callback) => {
  console.log('getWeatherData called', city);
  let url = `http://api.apixu.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=${10}`
  request(url, (err, res, body) => {
    console.log('Weather data received body');
    callback(body);
  });
};

addWeatherDataToDB = (cityName, data) => {
  console.log('addWeatherDataToDB called', cityName);
  new Weather({
      cityName: cityName,
      weatherData: data
    })
    .save();
};

updateWeatherDataInDB = (cityName, data) => {
  Weather
    .where({
      cityName: cityName
    })
    .save({weatherData: data}, {patch: true});
};

exports.addNewCityWeatherData = (city) => {
  console.log('City in addNewCityWeatherData', city);
  getCurrentTrackingCities(cities => {
    if(cities.indexOf(city) < 0) {
      console.log(city + ' data not in weather');
      getWeatherData(city, data => {
        console.log('Got weather data');
        addWeatherDataToDB(city, data);
      });
    } else {
      console.log('City exists');
    }
  });
};

getCurrentTrackingCities = (callback) => {
  Weather
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

exports.updateAllWeatherData = () => {
  getCurrentTrackingCities(cities => {
    let dataProcessed = 0;
    cities.forEach((city, index, arr) => {
      getWeatherData(city, (data) => {
        updateWeatherDataInDB(city, data);
        dataProcessed++;
        if(dataProcessed === arr.length) {
          console.log('All weather data updated in DB');
        }
      });
    });
  });
};

