import React, { useState, useEffect } from "react";
import makeStyles from '@material-ui/core/styles/makeStyles'
import { getUser, getToken, getAdmin } from "../utils/Common";
import { NavLink } from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box
} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#00c49a",
      },
      secondary: {
        main: "#7bb2d9",
      },
    },
  });


function RenderHeader() {
  const user = getUser();
  const [value, setValue] = useState();

  const refresh = () => {
    setValue({});
  };

  if (!getToken())
    return (
      <div>
          <ThemeProvider theme={theme}>
          <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
            ></IconButton>
            <Box display="flex" flexGrow={1}>
                <Typography variant="h6">Calendar.app</Typography>
            </Box>
            <Button color="inherit">
              <NavLink onClick={refresh} exact activeClassName="active" to="/">
                Home
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink onClick={refresh} activeClassName="active" to="/login">
                Login
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink
                onClick={refresh}
                activeClassName="active"
                to="/register"
              >
                Register
              </NavLink>
            </Button>
          </Toolbar>
        </AppBar>
          </ThemeProvider>
      </div>
    );

  if (getAdmin()) {
    return (
      <div>
        <ThemeProvider theme={theme}>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
            ></IconButton>
            <Box display="flex" flexGrow={1}>
                <Typography variant="h6">Calendar.app</Typography>
            </Box>
            <Button color="inherit">
              <NavLink onClick={refresh} exact activeClassName="active" to="/">
                Home
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink
                onClick={refresh}
                activeClassName="active"
                to="/dashboard"
              >
                Dashboard
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink
                onClick={refresh}
                activeClassName="active"
                to="/notesList"
              >
                Notes
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink
                onClick={refresh}
                activeClassName="active"
                to="/admin-dashboard"
              >
                Admin Dashboard
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink onClick={refresh} activeClassName="active" to="/logout">
                Logout
              </NavLink>
            </Button>
          </Toolbar>
        </AppBar>
        </ThemeProvider>
        <NavLink onClick={refresh} exact activeClassName="active" to="/">
          Home
        </NavLink>
      </div>
    );
  }

  return (
    <div>
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          ></IconButton>
          <Box display="flex" flexGrow={1}>
                <Typography variant="h6">Calendar.app</Typography>
            </Box>
          <Button color="inherit">
            <NavLink onClick={refresh} exact activeClassName="active" to="/">
              Home
            </NavLink>
          </Button>
          <Button color="inherit">
            <NavLink onClick={refresh} activeClassName="active" to="/dashboard">
              Dashboard
            </NavLink>
          </Button>
          <Button color="inherit">
            <NavLink onClick={refresh} activeClassName="active" to="/notesList">
              Notes
            </NavLink>
          </Button>
          <Button color="inherit">
            <NavLink onClick={refresh} activeClassName="active" to="/logout">
              Logout
            </NavLink>
          </Button>
        </Toolbar>
      </AppBar>
      </ThemeProvider>
      <NavLink onClick={refresh} exact activeClassName="active" to="/">
        Home
      </NavLink>
    </div>
  );
}

export default RenderHeader;
