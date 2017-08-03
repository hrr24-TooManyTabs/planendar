import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import Popup from 'react-popup';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';


BigCalendar.momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

class Dnd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      events: props.events,
      currentEvent: props.currentEvent,
      color: []
    }
    this.colorExample = 'lightgreen';
    this.moveEvent = this.moveEvent.bind(this);
    this.eventStyleGetter = this.eventStyleGetter.bind(this);
  }

  //function for drag and drop functionality
  moveEvent ({ event, start, end }) {
    start = moment(start)
    end = moment(end)
    start = start._i;
    end = end._i;

    this.props.selectEvent(event)
    this.props.updateAppointment('start_date_time', start)
    this.props.updateAppointment('end_date_time', end)
    this.props.createAppointment()
  }

  componentDidMount () {
    $.ajax({
      type: 'GET',
      url: '/colorScheme',
      success: function (colorInfo){
        this.setState({color: colorInfo});
        $('.navbar-default').css('background-color', colorInfo[0]);
      }.bind(this),
      error: function (err) {
        console.error(err);
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({events: nextProps.events, currentEvent: nextProps.currentEvent})
  }

  eventStyleGetter (event, start, end, isSelected) {
    var style = {
        backgroundColor: this.state.color[1],
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
  }

  render() {
    return (
      <div>
        <Popup
          className="mm-popup"
          btnClass="mm-popup__btn"
          closeBtn={true}
          closeHtml={null}
          defaultCancel="Cancel"
          wildClasses={false}
          closeOnOutsideClick={true}
        />
        <div className='calendar-box'>
        <DragAndDropCalendar
          selectable
          events={this.state.events}
          onEventDrop={this.moveEvent}
          defaultView='month'
          onSelectEvent={event => this.props.selectEvent(event)}
          onSelectSlot={slotInfo => { console.log(slotInfo.start) }}
          eventPropGetter={(this.eventStyleGetter)}
          popup={true}
          components={{
            event: Event
          }}
        />
        </div>
      </div>
    )
  }
}

function Event({ event }) {
  return (
    <span>
      <strong>
      {event.title}
      </strong>
      { event.description && (':  ' + event.description + ' | ')}
      { event.location }
    </span>
  )
}

export default DragDropContext(HTML5Backend)(Dnd)

