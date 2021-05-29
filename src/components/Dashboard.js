import React from 'react';
import { getUser, removeUserSession } from '../utils/Common';
import {DayGridCalendar, WeeklyCalendar} from './Calendar'

function Dashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/login');
  }

  return (
    <div>
      <WeeklyCalendar></WeeklyCalendar>
      Welcome {user.name}!<br /><br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;