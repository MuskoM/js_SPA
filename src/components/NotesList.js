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
  TextField, MenuItem
} from "@material-ui/core";
import { store } from "react-notifications-component";

class NotesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notesList: undefined,
      fullList: undefined,
      start: add(new Date(), { hours: 2 }).toISOString().slice(0, -8),
      end: add(new Date(), { hours: 3 }).toISOString().slice(0, -8),
      filter: "",
      sort: 1,
      categories: undefined,
      selectedCategory: undefined,
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

  styles = {
    root: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  };

  componentDidMount = () => {
    this.getData();
    
  };

  editNote = (note) => {

    let newNote = {
      id: note.id,
      title: note.title,
      start: note.dataOd,
      end: note.dataDo,
      noteBody: note.body + "Edited",
      priority: note.priority
    }

    axios.put('http://localhost:8002/notes/' + note.id, newNote).then(
      (resp) => {
        store.addNotification({
          ...this.notification,
          title: "Success!",
          message: "Succesfully updated a note.",
          type: "success",
        });
        this.getData();
      }
    ).catch((err) => {
      console.log("Can't delete a note", err)
    }
    )

  }

  deleteNote = (id) => {

    axios.delete('http://localhost:8002/notes/' + id).then(
      (resp) => {
        store.addNotification({
          ...this.notification,
          title: "Success!",
          message: "Succesfully deleted a note.",
          type: "success",
        });
        this.getData();
      }
    ).catch((err) => {
      console.log("Can't delete a note", err)
    })
  }


  getData = () => {
    axios
      .get(`http://localhost:8002/notes`)
      .then((response) => {
        let list = response.data;
        var user = JSON.parse(sessionStorage.user);

        list = list.filter(n => n.user == user.userId);
        this.setState({ notesList: list, fullList: list });
        this.setState({ isLoading: false });
        return list;
      })
      .catch((error) => {
        console.log(error);
      });

      axios
      .get(`http://localhost:8002/categories`)
      .then((response) => {
        let list = response.data;
        this.setState({ categories: list, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });

  }

  render() {
    const { isLoading } = this.state;

    let notesList = this.state.notesList;
    if (isLoading) {
      notesList = this.getData();
      return <div></div>;
    }

    const categories = this.state.categories;
    console.log("Kategorie", categories);

    const sortList = [
      { id: 1, name: "dataOd - rosnąco" },
      { id: 2, name: "dataOd - malejąco" },
      { id: 3, name: "dataDo - rosnąco" },
      { id: 4, name: "dataDo - malejąco" },
      { id: 5, name: "tytuł - rosnąco" },
      { id: 6, name: "tytuł - malejąco" }];

    if (notesList.length === 0) {
      return (
        <div className="NotesList">
          <TextField
            value={this.state.filter}
            variant="outlined"
            label="Search"
            onChange={this.handleFilterChange}
            type="search" aria-label="Search"
            className="SearchBar"
          ></TextField>
          <h3>No notes to view</h3>
        </div>
      );
    } else {
      return (
        <div className="NotesList">
          <div className="FilterBar">
            <TextField
              variant="filled"
              value={this.state.filter}
              label="Search"
              onChange={this.handleFilterChange}
              type="search" aria-label="Search"
              className="SearchBar"
            />
            <TextField label="sort" className="SearchBar" value={this.state.sort} variant="filled" select onChange={this.handleSorting}>
              {sortList.map((option, i) => {
                return (<MenuItem value={option.id} key={option.id}>{option.name}</MenuItem>)
              })}

            </TextField>
          </div>
          {notesList.map((note, key) => {
            return (
              <Note
                id={note.id}
                title={note.title}
                body={note.noteBody}
                priority={note.priority}
                dataOd={note.start}
                dataDo={note.end}
                deleteNote={this.deleteNote}
                editNote={this.editNote}
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
                  defaultValue={add(new Date(), { hours: 2 }).toISOString().slice(0, -8)}
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
                  defaultValue={add(new Date(), { hours: 3 }).toISOString().slice(0, -8)}
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
          <Fab onClick={() => this.showModal("addEventModal")} variant="extended" style={{ margin: '1rem', backgroundColor: "#ffd400" }}>
            <AddIcon />
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

  updateFilter = (e) => {
    this.setState({ filter: e.target.value });
  }

  handleFilterChange = (e) => {
    console.log("Filter changed", e.target.value);
    let list = this.state.fullList.filter(n => n.title.includes(e.target.value));
    console.log("list", list);
    this.setState({ filter: e.target.value, notesList: list });
  };

  handleSorting = (e) => {
    let sortVal = e.target.value;
    console.log("STATE", sortVal);
    this.setState({ sort: sortVal })

    switch (sortVal) {
      case 1:
        this.setState({
          noteList: this.state.notesList.sort((a, b) => {
            return (a.start > b.start) ? 1 : -1;
          })
        })
        break;
      case 2:
        this.setState({
          noteList: this.state.notesList.sort((a, b) => {
            return (a.start > b.start) ? -1 : 1;
          })
        })
        break;
      case 3:
        this.setState({
          noteList: this.state.notesList.sort((a, b) => {
            return (a.end > b.end) ? 1 : -1;
          })
        })
        break;
      case 4:
        this.setState({
          noteList: this.state.notesList.sort((a, b) => {
            return (a.end > b.end) ? -1 : 1;
          })
        })
        break;
      case 5:
        this.setState({
          noteList: this.state.notesList.sort((a, b) => {
            return (a.title > b.title) ? 1 : -1;
          })
        })
        break;
      case 6:
        this.setState({
          noteList: this.state.notesList.sort((a, b) => {
            return (a.title > b.title) ? -1 : 1;
          })
        })
        break;
      default:
        break;
    }
  }

  editNoteData = () => {

    let newNote = {
      title: this.state.title,
      start: this.state.start,
      end: this.state.end,
      noteBody: this.state.noteBody,
      priority: this.state.priority
    }

    console.log("Note edited", newNote)

    axios.put('http://localhost:8002/notes/', newNote).then(
      (resp) => {
        store.addNotification({
          ...this.notification,
          title: "Success!",
          message: "Added a note!",
          type: "success",
        });
      }
    ).catch((err) => {
      console.log("Sending a note was unsucessful", err)
    })

    this.hideModal('addEventModal')

    return (
      <div>
        <EventPopup />
      </div>
    );
  }

  submitEventData = () => {

    let newNote = {
      title: this.state.title,
      start: this.state.start,
      end: this.state.end,
      noteBody: this.state.noteBody,
      priority: this.state.priority,
      category: this.state.selectedCategory
    }

    console.log("Note added", newNote)

    axios.post('http://localhost:8002/notes/', newNote).then(
      (resp) => {
        store.addNotification({
          ...this.notification,
          title: "Success!",
          message: "Added a note!",
          type: "success",
        });
        this.setState({ isLoading: true });
      }
    ).catch((err) => {
      console.log("Sending a note was unsucessful", err)
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
