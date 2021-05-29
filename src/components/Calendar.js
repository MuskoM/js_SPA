import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import interactionPlugin from '@fullcalendar/interaction'
import React from 'react';


class DayGridCalendar extends React.Component{

}


class WeeklyCalendar extends React.Component{

    render(){
        return (
            <FullCalendar
              plugins={[ dayGridPlugin,interactionPlugin ]}
              initialView="dayGridMonth"
              eventSources={[{
                id:1,
                url: 'http://localhost:8002/notes',
                color: 'orange',   // an option!
                textColor: 'black',
                method:'GET'
              }]}
              height={window.innerHeight-250}
              aspectRatio={0.5}
              selectable={true}
              select={this.handleDateClick}
            />
          )
    }

    handleDateClick = (arg) => {
        let calendarAPI = arg.view.calendar
        let source = calendarAPI.getEventSources()[0]
        console.log(source)
        //source.context.method = "POST"
        console.log(source)
        calendarAPI.addEvent(
            {
                id:1,
                title:'New Event',
                start:arg.startStr,
                end:arg.endStr,
                allDat:arg.allDay
            },
            true
        )

        axios.post('http://localhost:8002/notes',{
            title:'New Event',
            start:arg.startStr,
            end:arg.endStr,
            allDat:arg.allDay
        }).then(response =>{
            console.log(response)
        }).catch(error => {
            console.log(error)
        })

    }

}


export {DayGridCalendar,WeeklyCalendar};