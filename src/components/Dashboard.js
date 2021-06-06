import React from 'react';
// import { getUser } from '../utils/Common';
import {WeeklyCalendar} from './Calendar'
// import {DayGridCalendar} from './Calendar'

function Dashboard(props) {
  // const user = getUser();

  return (
    <div>
      <WeeklyCalendar></WeeklyCalendar>
    </div>
  );
}

export default Dashboard;