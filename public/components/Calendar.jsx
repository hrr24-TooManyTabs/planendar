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
      currentEvent: props.currentEvent
    }
    this.moveEvent = this.moveEvent.bind(this)
  }

  moveEvent({ event, start, end }) {
    start = moment(start)
    end = moment(end)
    start = start._i;
    end = end._i;

    this.props.selectEvent(event)
    this.props.updateAppointment('start_date_time', start)
    this.props.updateAppointment('end_date_time', end)
    this.props.createAppointment()
  }



  componentWillReceiveProps(nextProps) {
    this.setState({events: nextProps.events, currentEvent: nextProps.currentEvent})
  }

  //prevent calendar from rerendering unnecessarily
 /* shouldComponentUpdate(nextProps) {
    return ((this.state.currentEvent !== nextProps.currentEvent) || (this.state.events !== nextProps.events));
  }
*/
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
          onSelectSlot={slotInfo => { alert(slotInfo.start) }}
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

