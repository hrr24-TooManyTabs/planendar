import React from 'react';
import moment from 'moment';
import Popup from 'react-popup';
import _ from 'underscore';

class Summary extends React.Component {

  constructor() {
    super();
    this.state = {
      currentDate: new Date()
    }

    this.getDailySummary = this.getDailySummary.bind(this);
    this.showDailySummary = this.showDailySummary.bind(this);
    this.showNoActivity = this.showNoActivity.bind(this);
  }

  getDailySummary(date) {
    // date = (!date) ? moment() : moment(date);
    // console.log(moment());
    if(!date) {
      date = new Date();
    }

    let startDayTime = moment(date).startOf('day');
    let endDayTime = moment(date).endOf('day');
    // console.log(startDayTime);
    // console.log(endDayTime);
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

  showNoActivity() {
    let title = 'this.state.currentDate;';
    let content = 'No Activity';

    Popup.create({
      title: title,
      content: content,
      noOverlay: true,
    });
  }

  showDailySummary(summaryDataObj) {
    let title = 'this.state.currentDate';
    let content = '';

    if(_.isEmpty(summaryDataObj)) {
      content = 'No Activity';
    } else {
      for(var tag in summaryDataObj) {
        content += tag + ': ' + summaryDataObj[tag] + '\n';
      }
    }

    Popup.create({
      title: title,
      content: content,
      noOverlay: true,
    });
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={this.getDailySummary}>Daily Summary</button>
    );
  }
}

export default Summary;