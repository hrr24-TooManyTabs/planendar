import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import events from '../events'
import moment from 'moment';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

class Dnd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      events: events
    }

    this.moveEvent = this.moveEvent.bind(this)
  }

  moveEvent({ event, start, end }) {
    const { events } = this.state;

    const index = events.indexOf(event);
    const updatedEvent = { event, start, end };

    const nextEvents = [...events]
    nextEvents.splice(index, 1, updatedEvent)

    this.setState({
      events: nextEvents
    })

    alert('Test');
  }

  render() {
    return (
      <DragAndDropCalendar
        selectable
        events={this.state.events}
        onEventDrop={this.moveEvent}
        defaultView='week'
      />
    )
  }


}

export default DragDropContext(HTML5Backend)(Dnd)

