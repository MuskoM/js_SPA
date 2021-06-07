import axios from "axios";
import { React, Component } from "react";
import Note from "./Note";
import add from "date-fns/add"
import Rating from "@material-ui/lab/Rating";
import { PriorityHigh } from "@material-ui/icons";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EventPopup from "./EventPopup";
import {
  TextField,
} from "@material-ui/core";
import { store } from "react-notifications-component";

class NotesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notesList: undefined,
      start:add(new Date(),{hours:2}).toISOString().slice(0,-8),
      end:add(new Date(),{hours:3}).toISOString().slice(0,-8)
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


  componentDidMount = () => {
    axios
      .get(`http://localhost:8002/notes`)
      .then((response) => {
        this.setState({ notesList: response.data });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { isLoading, notesList } = this.state;

    if (isLoading) {      
      return <div>Loading...</div>;
    }

    if (notesList.length === 0) {
      return (
        <div className="NotesList">
          <h3>No notes to view</h3>
        </div>
      );
    } else {
      return (
        <div className="NotesList">
          {notesList.map((note, key) => {
            console.log(note.start)
            return (
              <Note
                id={note.id}
                title={note.title}
                body={note.noteBody}
                priority={note.priority}
                dataOd={note.start}
                dataDo={note.end}
              ></Note>
            );
          })}
          <div className="modal" id="addEventModal">
            <div className="modal-content" id="addEventModalContent">
              <div className="modal-element">
                <TextField
                  variant="outlined"
                  id="dataOd"
                  classes={{ root: "modal-element-label" }}
                  label="Data od"
                  defaultValue={add(new Date(),{hours:2}).toISOString().slice(0,-8)}
                  type="datetime-local"
                  onChange={(e) => {
                    this.setState({ start: e.target.value });
                  }}
                ></TextField>
              </div>
              <div className="modal-element">
                <TextField
                  variant="outlined"
                  id="dataDo"
                  label="Data do"
                  defaultValue={add(new Date(),{hours:3}).toISOString().slice(0,-8)}
                  type="datetime-local"
                  onChange={(e) => {
                    this.setState({ end: e.target.value });
                  }}
                ></TextField>
              </div>
              <div className="modal-element">
                <TextField
                  variant="outlined"
                  id="title"
                  label="Tytuł"
                  type="text"
                  onChange={(e) => {
                    this.setState({ title: e.target.value });
                  }}
                ></TextField>
              </div>
              <div className="modal-element">
                <TextField
                  variant="outlined"
                  id="noteBody"
                  label="Notatka"
                  multiline={true}
                  rows={4}
                  onChange={(e) => {
                    this.setState({ noteBody: e.target.value });
                  }}
                ></TextField>
              </div>
              <div
                className="modal-element"
                style={{
                  border: " 0.5px solid rgba(0,0,0,.2)",
                  borderRadius: ".3rem",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                  paddingLeft: "0.5rem",
                  width: "30%",
                }}
              >
                <label>Priority</label>
                <br></br>
                <Rating
                  id="prioritySelector"
                  max={3}
                  classes={{ iconFilled: "priority-icon-filled" }}
                  defaultValue={2}
                  name="priority"
                  icon={<PriorityHigh fontSize="inherit" />}
                  onChange={(e) => {
                    this.setState({ priority: e.target.value });
                  }}
                ></Rating>
              </div>
              <div style={{ paddingBottom: "1rem" }}>
                <PrimaryButton onClick={this.submitEventData}>
                  Submit
                </PrimaryButton>
              </div>
              <div>
                <SecondaryButton
                  onClick={() => {
                    this.hideModal("addEventModal");
                  }}
                >
                  Close
                </SecondaryButton>
              </div>
            </div>
          </div>
          <Fab onClick={()=>this.showModal("addEventModal")} variant="extended" style={{margin:'1rem',backgroundColor:"#ffd400"}}>
            <AddIcon/>
            Add
          </Fab>
        </div>
      );
    }
  }

  showModal = (name) => {
    var modal = document.getElementById(name);
    modal.style.display = "block";
  };

  hideModal = (name) => {
    let modal = document.getElementById(name);
    modal.style.display = "none";
  };


  editNoteData = () =>{

    console.log(this.state)

    let newNote = {
        title:this.state.title,
        start:this.state.start,
        end:this.state.end,
        noteBody:this.state.noteBody,
        priority:this.state.priority
    }

    console.log("Note added",newNote)

      axios.put('http://localhost:8002/notes/' ,newNote).then(
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

  submitEventData = () =>{

    console.log(this.state)

    let newNote = {
        title:this.state.title,
        start:this.state.start,
        end:this.state.end,
        noteBody:this.state.noteBody,
        priority:this.state.priority
    }

    console.log("Note added",newNote)

      axios.post('http://localhost:8002/notes/',newNote).then(
          (resp)=>{store.addNotification({
            ...this.notification,
            title: "Success!",
            message: "Added a note!",
            type: "success",
          });
          this.setState({isLoading : false});
        }
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
}

export default NotesList;
