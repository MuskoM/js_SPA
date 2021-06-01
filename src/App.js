import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Home from "./components/Home";
import RenderHeader from "./components/RenderHeader";
import Logout from './components/Logout';
import NotesList from './components/NotesList';
import EditUser from './components/EditUser';

import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import AdminRoute from "./utils/AdminRoute";
import { getToken, removeUserSession, setUserSession } from "./utils/Common";

function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    axios
      .get(`http://localhost:8002/verifyToken?token=${token}`)
      .then((response) => {
        setUserSession(response.data.token, response.data.user);
        setAuthLoading(false);
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(false);
      });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>;
  }

  return (
    <div className="App">
      <ReactNotification/>
      <BrowserRouter>
        <div>
          <div class="navbar navbar-expand-lg navbar-light bg-light" className="header">
            <RenderHeader/>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PublicRoute path="/register" component={Register} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/notesList" component={NotesList} />
              <PrivateRoute path="/edit-user" component={EditUser} />
              <PrivateRoute path="/logout" component={Logout} />
              <AdminRoute path="/admin-dashboard" component={AdminDashboard} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
