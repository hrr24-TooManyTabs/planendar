import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
//import events from '../events'
import moment from 'moment';
import Popup from 'react-popup';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

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
     const { events } = this.state;

     const idx = events.indexOf(event);
     const updatedEvent = { event, start, end };

     const nextEvents = [...events]
     nextEvents.splice(idx, 1, updatedEvent)

     this.setState({
       events: nextEvents
     })

     alert(`${event.title} was dropped onto ${event.start}`);
   }

  componentWillReceiveProps(nextProps) {
    this.setState({events: nextProps.events, currentEvent: nextProps.currentEvent})
    //console.log(this.state.events)
  }

  //prevent calendar from rerendering unnecessarily
 /* shouldComponentUpdate(nextProps) {
    return ((this.state.currentEvent !== nextProps.currentEvent) || (this.state.events !== nextProps.events));
  }
*/
  render() {
    //console.log(this.state.events)
    return (
      <div>
        <Popup
          className="mm-popup"
          btnClass="mm-popup__btn"
          closeBtn={true}
          closeHtml={null}
          defaultOk="Ok"
          defaultCancel="Cancel"
          wildClasses={false}
          closeOnOutsideClick={false}
        />
        <DragAndDropCalendar
          selectable
          events={this.state.events}
          onEventDrop={this.moveEvent}
          defaultView='week'
          onSelectEvent={event => this.props.selectEvent(event)}
          onSelectSlot={slotInfo => { alert(slotInfo.start) }}
        />
      </div>
    )
  }


}

export default DragDropContext(HTML5Backend)(Dnd)

