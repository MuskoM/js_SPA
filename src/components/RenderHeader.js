import React, {useState, useEffect} from 'react';
import { getUser,getToken, getAdmin } from '../utils/Common';
import { NavLink } from 'react-router-dom';

function RenderHeader(){
  const user = getUser();
  const [value,setValue] = useState();

  const refresh = ()=>{
    setValue({});
}

    if (!getToken())
    return (
        <div>
            <NavLink onClick={refresh} exact activeClassName="active" to="/">Home</NavLink>
            <NavLink onClick={refresh} activeClassName="active" to="/login">Login</NavLink>
            <NavLink onClick={refresh} activeClassName="active" to="/register">Register</NavLink>
        </div>
    );

    if (getAdmin())
    {
        return (
            <div>
                <NavLink onClick={refresh} exact activeClassName="active" to="/">Home</NavLink>
                <NavLink onClick={refresh} activeClassName="active" to="/dashboard">Dashboard</NavLink>
                <NavLink onClick={refresh} activeClassName="active" to="/admin-dashboard">AdminDashboard</NavLink>

            </div>
        )
    }



  return (
    <div>
        <NavLink onClick={refresh} exact activeClassName="active" to="/">Home</NavLink>
        <NavLink onClick={refresh} activeClassName="active" to="/dashboard">Dashboard</NavLink>
  <NavLink onClick={refresh} activeClassName="active" to="/admin-dashboard">AdminDashboard</NavLink>
    </div>
  );
}

export default RenderHeader;