import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import interactionPlugin from '@fullcalendar/interaction'
import React from 'react';
import EventPopup from './EventPopup';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';
import { store } from 'react-notifications-component';


class DayGridCalendar extends React.Component{

}


class WeeklyCalendar extends React.Component{

    notification = {
        title: "Test notification",
        message: "You shouldn't see it here.",
        type: "success",
        insert: "bottom",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      }

    render(){
        return (
            <div>
                <FullCalendar
                  plugins={[ dayGridPlugin,interactionPlugin ]}
                  initialView="dayGridMonth"
                  eventSources={[{
                    id:1,
                    url: 'http://localhost:8002/notes',
                    color: '#ffd400',   // an option!
                    textColor: 'black',
                    method:'GET'
                  }]}
                  height={window.innerHeight-250}
                  aspectRatio={0.5}
                  selectable={true}
                  select={this.handleDateClick}
                />
            </div>
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
            allDate:arg.allDay
        }).then(response =>{
            console.log(response)
        }).catch(error => {
            console.log(error)
        });

        store.addNotification({
            ...this.notification,
            title: "Success!",
            message: "Added new event to calendar.",
            type: "success"
        });


        return (
            <div>
                <EventPopup/>
            </div>
        )
    }

}


export {DayGridCalendar,WeeklyCalendar};