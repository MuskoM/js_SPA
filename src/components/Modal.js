import {React, useState} from 'react';
import {
    TextField, MenuItem
  } from "@material-ui/core";
import add from "date-fns/add"
import {Rating} from '@material-ui/lab'
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { PriorityHigh } from "@material-ui/icons";

let Modal = (props) =>{

    console.log(props)
    const showHideClassName = props.show ? "modal display-block" : "modal display-none";
    let c = props.categories[0].name
    let [selectedCategory,setSelectedCategory] = useState(c)
    let [title,setTitle] = useState()
    let [body,setBody] = useState()
    let [start,setStart] = useState(add(new Date(), { hours: 2 }).toISOString().slice(0, -8))
    let [end,setEnd] = useState(add(new Date(), { hours: 3 }).toISOString().slice(0, -8))
    let [priority,setPriority] = useState()
    

    return(
        <div className={showHideClassName} id="addEventModal">
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
                setStart(e.target.value)
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
                setEnd(e.target.value)
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
                setTitle(e.target.value)
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
                setBody(e.target.value)
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
                setPriority(e.target.value)
              }}
            ></Rating>
          </div>
          <div className="modal-element">
            <TextField label="Kategoria" value={selectedCategory} variant="outlined" select onChange={(e) => {
             setSelectedCategory(e.target.value)
            }}>
              {props.categories.map((option, i) => {
                    return (<MenuItem value={option.id} key={option.id}>{option.name}</MenuItem>)
                  })}

            </TextField>
          </div>

          <div style={{ paddingBottom: "1rem" }}>
            <PrimaryButton onClick={()=>{props.addNote({
                title: title,
                start: start,
                end: end,
                noteBody: body,
                priority: priority,
                category: selectedCategory
            })}}>
              Submit
            </PrimaryButton>
          </div>
          <div>
            <SecondaryButton onClick={props.closeModal}
            >
              Close
            </SecondaryButton>
          </div>
        </div>
      </div>
    )

}

export default Modal;