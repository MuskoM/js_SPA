import React from 'react';
import { getUser } from '../utils/Common';
import UserList from './UserList';
import CategoriesList from './CategoriesList';

function AdminDashboard(props) {
  const user = getUser();
  return (
    <div>
      <h3>Users</h3>
      <UserList></UserList>
      <h3>Categories</h3>
      <CategoriesList></CategoriesList>
    </div>
  );
}

export default AdminDashboard;