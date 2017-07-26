import React from 'react';

const WeatherInfo = ({icon, date, avgtemp_f}) => {
  return (
    <div className="col-sm-1 weather-info">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
          <img src={icon}></img>
          </div>
        </div>
        <div className="row">
            <div className="col-sm-6">
              <p>{date}</p>
            </div>
            <div className="col-sm-6">
              <p>{avgtemp_f}˚F</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
