import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import interactionPlugin from "@fullcalendar/interaction";
import React from "react";
import {LocalConvenienceStoreOutlined, PriorityHigh} from '@material-ui/icons'
import PrimaryButton from './Buttons/PrimaryButton'
import EventPopup from "./EventPopup";
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  TextareaAutosize,
} from "@material-ui/core";
import { store } from "react-notifications-component";

const priorityIcons = {
    1:{
        icon:<PriorityHigh/>,
        label: "Low"
    },
    2:{
        icon:<PriorityHigh/>,
        label: "Medium"
    },
    3:{
        icon:<PriorityHigh/>,
        label: "High"
    }
}

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{priorityIcons[value].icon}</span>;
  }
  
  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

class DayGridCalendar extends React.Component {}

class WeeklyCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: undefined,
      end: undefined,
      title: "",
      noteBody: "",
      priority: 2,
    };
  }

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
      onScreen: true,
    },
  };

  render() {
    return (
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          eventSources={[
            {
              id: 1,
              url: "http://localhost:8002/notes",
              color: "#ffd400", // an option!
              textColor: "black",
              method: "GET",
            },
          ]}
          height={window.innerHeight - 250}
          aspectRatio={0.5}
          selectable={true}
          select={this.addEvent}
        />
        <div className="modal" id="addEventModal">
          <div className="modal-content" id="addEventModalContent">
            <div className="modal-element">
              <TextField
                variant="outlined"
                id="dataOd"
                classes={{ root: "modal-element-label" }}
                label="Data od"
                defaultValue="2017-05-24T10:30"
                type="datetime-local"
                onChange={(e)=>{
                    this.setState({dataOd:e.target.value})
                }}
              ></TextField>
            </div>
            <div className="modal-element">
              <TextField
                variant="outlined"
                id="dataDo"
                label="Data do"
                defaultValue="2017-05-24T10:30"
                type="datetime-local"
                onChange={(e)=>{
                    this.setState({dataDo:e.target.value})
                }}
              ></TextField>
            </div>
            <div className="modal-element">
              <TextField 
              variant="outlined"
              id="title"
              label="Tytuł" 
              type="text"
              onChange={(e)=>{
                this.setState({title:e.target.value})
            }}
              ></TextField>
            </div>
            <div className="modal-element">
              <TextField 
              variant="outlined"
              id="noteBody"
              label="Notatka" 
              multiline={true} rows={4}
              onChange={(e)=>{
                this.setState({noteBody:e.target.value})
            }}
              ></TextField>
            </div>
            <div className="modal-element">
                <label>Priority</label><br></br>
              <Rating
              id="prioritySelector" 
              max={3}
              classes={{iconFilled:"priority-icon-filled"}}
              defaultValue={2}
              getLabelText={(value)=>priorityIcons[value].label}
              IconContainerComponent={IconContainer}
              name="priority"
              onChange={(e)=>{
                this.setState({priority:e.target.value})
            }}></Rating>
            </div>
            <PrimaryButton
              onClick={() => {
                this.hideModal("addEventModal");
              }}
            >
              Close
            </PrimaryButton>
            <PrimaryButton onClick={()=>{console.log(this.state)}}>
                TEEST
            </PrimaryButton>
            <PrimaryButton onClick={this.submitEventData}>
                Submit
            </PrimaryButton>
          </div>
        </div>
        
      </div>
    );
  }

  showModal = (name) => {
    var modal = document.getElementById(name);
    modal.style.display = "block";
  };

  hideModal = (name) => {
    let modal = document.getElementById(name);
    modal.style.display = "none";
  };

  submitEventData = () =>{
    
    let newNote = {
        title:this.state.title,
        start:this.state.start,
        end:this.state.end,
        noteBody:this.state.noteBody,
        priority:this.state.priority
    }

    console.log("Note added",newNote)

    this.state.calendar.addEvent(
        newNote,
        true
      );

      axios.post('http://localhost:8002/notes/',newNote).then(
          (resp)=>{store.addNotification({
            ...this.notification,
            title: "Success!",
            message: "Added a note!",
            type: "success",
          });}
      ).catch((err)=>{
        console.log("Sending a note was unsucessful",err)
      })

      this.hideModal('addEventModal')

      return (
        <div>
          <EventPopup />
        </div>
      );
  }

  addEvent = (info) => {
    console.log(info);
    this.showModal("addEventModal");
    this.setState({calendar:info.view.calendar})
    let dataOd = document.getElementById("dataOd")
    dataOd.value = info.start.toISOString().slice(0,-8)
    this.setState({start:info.start.toISOString().slice(0,-8)})

    let dataDo = document.getElementById("dataDo")
    this.setState({end:info.end.toISOString().slice(0,-8)})
    dataDo.value = info.end.toISOString().slice(0,-8)
  };

}

export { DayGridCalendar, WeeklyCalendar };
