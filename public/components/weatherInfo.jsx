import React from 'react';

const WeatherInfo = ({hourlyWeather}) => {
  return (
    <div className="col-sm-1 weather-info">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
          <img src="http://cdn.apixu.com/weather/64x64/day/113.png"></img>
          </div>
        </div>
        <div className="row">
            <div className="col-sm-6">
              <p>12/22</p>
            </div>
            <div className="col-sm-6">
              <p>{hourlyWeather}00˚F</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
