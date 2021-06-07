import { Accordion } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import {PriorityHigh} from '@material-ui/icons'
// import {LocalConvenienceStoreOutlined} from '@material-ui/icons'
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import PrimaryButton, { SecondaryButton } from "./Buttons";
import axios from "axios";
import { store } from "react-notifications-component";

let notification = {
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

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#b3b8bc",
    width: "50%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.primary,
  },
}));

const StyledRating = withStyles({
  iconFilled: {
    color: "#ffd400",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

let Note = (props) => {
  const classes = useStyles();
  let dataOd = new Date(props.dataOd).toLocaleDateString();
  let dataDo = new Date(props.dataDo).toLocaleDateString();
  let godzOd = new Date(props.dataOd).toLocaleTimeString();
  let godzDo = new Date(props.dataDo).toLocaleTimeString();
  const [expanded, setExpanded] = React.useState(false);
  const [isLoading,setLoading] = React.useState(false)

  
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = React.useState(2);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let deleteNote = (id) =>{

    axios.delete('http://localhost:8002/notes/'+ id).then(
      (resp)=>{store.addNotification({
        notification,
        title: "Success!",
        message: "Succesfully deleted a note.",
        type: "success",
      });
      setLoading(true)
    }
  ).catch((err)=>{
    console.log("Can't delete a note",err)
  })
  
  }


  let id = props.id;

  if(isLoading){
    return(
      <div>Loading...</div>
    )
  }

  return (
    <Accordion
      className={classes.root}
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography className={classes.heading}>{props.title} {props.id}</Typography>
        <Typography className={classes.secondaryHeading}>
          Od: {dataOd},{godzOd} Do: {dataDo},{godzDo}{" "}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="note-container">
        <div id="body">
          <Typography>{props.body}</Typography>
        </div>
        <div id="notePriority"style={{alignSelf:"flex-end"}}>
            <StyledRating
            name="priority"
            value={props.priority}
            readOnly
            icon={<PriorityHigh fontSize="inherit"/>}
            max={3}
            >
            </StyledRating>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <PrimaryButton style={{width:'30%',marginTop:"1rem",marginBottom:"1rem"}}>Edit</PrimaryButton>
        <SecondaryButton onClick={()=>deleteNote(id)} style={{width:'30%',marginTop:"1rem",marginBottom:"1rem"}}>Delete</SecondaryButton>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Note;
