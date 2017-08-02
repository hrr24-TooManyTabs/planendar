import React from 'react';
import moment from 'moment';
import Popup from 'react-popup';
import _ from 'underscore';

class Summary extends React.Component {

  constructor() {
    super();
    this.state = {
      currentDate: moment()
    }

    this.getDailySummary = this.getDailySummary.bind(this);
    this.showDailySummary = this.showDailySummary.bind(this);
    this.showNoActivity = this.showNoActivity.bind(this);
    this.showNextDay = this.showNextDay.bind(this);
    this.showPrevDay = this.showPrevDay.bind(this);
  }

  getDailySummary(date) {
    if(!date) {
      date = new Date();
      this.setState({ currentDate: moment() })
    }

    let startDayTime = moment(date).startOf('day');
    let endDayTime = moment(date).endOf('day');

    $.ajax({
      url: `/summary/${startDayTime}/${endDayTime}`,
      type: 'GET',
      success: response => {
        if(_.isEmpty(response)) {
          this.showNoActivity();
        } else {
          this.showDailySummary(response);
        }
      },
      error: err => {
        console.log('error from dailySummary', err);
      }
    });
  }

  showNextDay() {
    let nextDay = this.state.currentDate.add(1, 'days')
    this.setState({
      currentDate: nextDay
    })
    this.getDailySummary(this.state.currentDate.toDate())
    Popup.close();
  }

  showPrevDay() {
    let prevDay = this.state.currentDate.subtract(1, 'days')
    this.setState({
      currentDate: prevDay
    })
    this.getDailySummary(this.state.currentDate.toDate())
    Popup.close();
  }

  showNoActivity() {
    let title = this.state.currentDate.format("dddd, MMMM Do YYYY").toString();;
    let content = 'No Activity';
    let left = {
        text: '<',
        action: () => { this.showPrevDay() }
    }
    let right = {
        text: '>',
        action: () => { this.showNextDay() }
    }

    Popup.create({
      title: title,
      content: content,
      noOverlay: true,
      buttons: {
        left: [left],
        right: [right]
      }
    });
  }

  showDailySummary(summaryDataObj) {
    let title = this.state.currentDate.format("dddd, MMMM Do YYYY").toString();
    let content = '';

    if(_.isEmpty(summaryDataObj)) {
      content = 'No Activity';
    } else {
      for(var tag in summaryDataObj) {
        content += tag + ': ' + summaryDataObj[tag] + '\n';
      }
    }

    let left = {
        text: '<',
        className: 'special-btn',
        action: () => { this.showPrevDay() }
    }
    let right = {
        text: '>',
        className: 'special-btn',
        action: () => { this.showNextDay() }
    }

    Popup.create({
      title: title,
      content: content,
      noOverlay: true,
      buttons: {
        left: [left],
        right: [right]
      }
    });
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={this.getDailySummary}>Daily Summary</button>
    );
  }
}

export default Summary;