import React from 'react';
import { getUser } from '../utils/Common';

function AdminDashboard(props) {
  const user = getUser();

  return (
    <div>
      Welcome Mr Admin {user.name}!<br /><br />
    </div>
  );
}

export default AdminDashboard;