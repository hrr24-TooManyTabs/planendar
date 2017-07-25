import React from 'react';
import WeatherInfo from './WeatherInfo.jsx';

const WeatherBar = ({forecast, getWeather}) => {

  var handleSubmit = function(e) {
    e.preventDefault();
    getWeather(e.target.elements.cityName.value);
  }

  return (
    <div className="container-fluid weather-bar">
      <div className="row">
        <div className="col-sm-2 weather-form-input">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <h4>Weather Forecast</h4>
              <input type="text" className="form-control" placeholder="City Name" name="cityName"/>
            </div>
          </form>
        </div>
        {
          forecast.forecastday.map(function(hourlyWeather, i) {
            return (
              <WeatherInfo key={i} hourlyWeather={hourlyWeather}></WeatherInfo>
            );
          })
        }
      </div>
    </div>
  );
};

export default WeatherBar;
