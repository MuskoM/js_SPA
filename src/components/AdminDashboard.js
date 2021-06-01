import React from 'react';
import { getUser } from '../utils/Common';
import UserList from './UserList';

function AdminDashboard(props) {
  const user = getUser();
  return (
    <div>
      Welcome Mr Admin {user.name}!<br /><br />
      <UserList></UserList>
    </div>
  );
}

export default AdminDashboard;