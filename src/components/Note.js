import { Accordion} from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { makeStyles } from '@material-ui/core/styles';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#7bb2d9',
        width:"50%"
      },
    heading: {
      fontSize: theme.typography.pxToRem(18),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.primary,
    },
  }));


let Note = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [value,setValue] = React.useState(2)

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
      };

        return(<Accordion className={classes.root} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{props.text}</Typography>
          <Typography className={classes.secondaryHeading}>Skrócony tekst notatki here</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className={classes.heading}>
            Od: {props.dataOd}<br></br>
            Od: {props.dataDo}<br></br>
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Priorytet
            <Rating
            name="priority"
            value={value}
            onChange={(event,newValue)=>{
                setValue(newValue);
            }}>
          </Rating>
          </Typography>
        </AccordionDetails>
      </Accordion>)
    }

export default Note;