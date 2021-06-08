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
import Modal from './Modal';
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
      show:false,
      start: add(new Date(), { hours: 2 }).toISOString().slice(0, -8),
      end: add(new Date(), { hours: 3 }).toISOString().slice(0, -8),
      filter: "",
      sort: 1,
      categories: undefined,
      selectedCategory: undefined,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
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
    axios
      .get(`http://localhost:8002/categories`)
      .then((response) => {
        let list = response.data;
        this.setState({ categories: list, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      }); 
  };

  editNote = (note) => {
    console.log("Edit")
    console.log(note)
    var user = JSON.parse(sessionStorage.user);

    let newNote = {
      id: note.id,
      title: note.title,
      start: note.start,
      end: note.end,
      noteBody: note.noteBody,
      priority: note.priority,
      category:note.category,
      user: parseInt(user.userId)
    }

    axios.put('http://localhost:8002/notes/' + note.id, newNote).then(
      (resp) => {
        store.addNotification({
          ...this.notification,
          title: "Success!",
          message: "Succesfully updated a note.",
          type: "success",
        });
        console.log("Edited")
        this.getData();
        this.hideModal();
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
        return list;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  render() {
    const { isLoading } = this.state;

    let notesList = this.state.notesList;
    if (isLoading) {
      notesList = this.getData();
      return <div></div>;
    }

    const sortList = [
      { id: 1, name: "dataOd - rosnąco" },
      { id: 2, name: "dataOd - malejąco" },
      { id: 3, name: "dataDo - rosnąco" },
      { id: 4, name: "dataDo - malejąco" },
      { id: 5, name: "tytuł - rosnąco" },
      { id: 6, name: "tytuł - malejąco" }];

    if (notesList === undefined || notesList.length === 0) {
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
          <h3>No notes to view</h3>
          <Fab onClick={() => this.showModal("addEventModal")} variant="extended" style={{ margin: '1rem', backgroundColor: "#ffd400" }}>
            <AddIcon />
            Add
          </Fab>
          <Modal show={this.state.show} addNote={this.submitEventData} closeModal={this.hideModal} categories={this.state.categories} ></Modal>
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
                category={note.category}
                deleteNote={this.deleteNote}
                editNote={this.editNote}
                categories={this.state.categories}
              ></Note>
            );
          })}
          <Modal show={this.state.show} priority="2" addNote={this.submitEventData} closeModal={this.hideModal} categories={this.state.categories} ></Modal>
          <Fab onClick={() => this.showModal("addEventModal")} variant="extended" style={{ margin: '1rem', backgroundColor: "#ffd400" }}>
            <AddIcon />
            Add
          </Fab>
        </div>
      );
    }
  }


  showModal = (name) => {
    // var modal = document.getElementById(name);
    // modal.style.display = "block";
    this.setState({show:true})
  };

  hideModal = (name) => {
    // let modal = document.getElementById(name);
    // modal.style.display = "none";
    this.setState({show:false})
  };

  updateFilter = (e) => {
    this.setState({ filter: e.target.value });
  }

  handleFilterChange = (e) => {
    console.log("Filter changed", e.target.value);
    let list = this.state.fullList.filter(n => n.title.includes(e.target.value));
    console.log("list", list);
    this.setState({isLoading: false})

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

  submitEventData = (data) => {

    var user = JSON.parse(sessionStorage.user);

    console.log("ass",data)

    let newNote = {
      title: data.title,
      start: data.start,
      end: data.end,
      noteBody: data.noteBody,
      priority: data.priority,
      category: data.category,
      user: parseInt(user.userId)
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
        let list = this.getData();
        this.setState({noteList: list});

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
