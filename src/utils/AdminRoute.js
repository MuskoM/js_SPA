import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAdmin } from './Common';

// handle the admin routes
function AdminRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => getAdmin() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />}
    />
  )
}

export default AdminRoute;