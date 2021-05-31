import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#00c49a',
        width:"100%"
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
    paper:{
        backgroundColor: '#faf9f9'
    }
  }));

  export default useStyles;