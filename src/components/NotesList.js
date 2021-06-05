import axios from "axios";
import { React, Component } from "react";
import Note from "./Note";

class NotesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notesList: undefined,
    };
  }

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

    if(notesList.length===0){
      return(<div className="NotesList">
        <h3>No notes to view</h3>
      </div>)
    }else{
      return (
        <div className="NotesList">
          {notesList.map((note,key) => {
           return (<Note 
            title={note.title}
            body={note.noteBody}
            priority={note.priority}
            dataOd={note.start}
            dataDo={note.end}
            ></Note>)
          })}
        </div>
    );
    }
  }

}

export default NotesList;
