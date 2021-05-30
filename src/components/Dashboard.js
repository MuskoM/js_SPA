import React from 'react';
import { getUser, removeUserSession } from '../utils/Common';
import {DayGridCalendar, WeeklyCalendar} from './Calendar'

function Dashboard(props) {
  const user = getUser();

  return (
    <div>
      <WeeklyCalendar></WeeklyCalendar>
      Welcome {user.name}!<br /><br />
    </div>
  );
}

export default Dashboard;