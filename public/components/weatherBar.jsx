import React from 'react';
import WeatherInfo from './WeatherInfo.jsx';

const WeatherBar = ({forecastday, getWeather}) => {

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
          forecastday.map(function(hourlyWeather, i) {
            let icon = hourlyWeather.day.condition.icon;
            let date = hourlyWeather.date.slice(5).replace('-', '/');
            let avgtemp_f = hourlyWeather.day.avgtemp_f;

            return (
              <WeatherInfo key={i} icon={icon} date={date} avgtemp_f={avgtemp_f}></WeatherInfo>
            );
          })
        }
      </div>
    </div>
  );
};

export default WeatherBar;
