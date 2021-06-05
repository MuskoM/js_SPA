import { Accordion } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import {LocalConvenienceStoreOutlined, PriorityHigh} from '@material-ui/icons'
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#7bb2d9",
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
  let dataDo = new Date(props.dataOd).toLocaleDateString();
  let godzOd = new Date(props.dataOd).toLocaleTimeString();
  let godzDo = new Date(props.dataOd).toLocaleTimeString();
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState(2);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
        <Typography className={classes.heading}>{props.title}</Typography>
        <Typography className={classes.secondaryHeading}>
          {" "}
          Od: {dataOd},{godzOd} Do: {dataDo},{godzDo}{" "}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="note-container">
        <div id="body">
          <Typography>{props.body}</Typography>
        </div>
        <div id="notePriority">
          <Typography>
            Priorytet
            <StyledRating
            name="priority"
            value={props.priority}
            readOnly
            icon={<PriorityHigh fontSize="inherit"/>}
            max={3}>
            </StyledRating>
          </Typography>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Note;
