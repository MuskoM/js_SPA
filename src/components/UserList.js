import React from 'react';
import axios from 'axios';

class UserList extends React.Component{
    render(){
  //this.setError(null);
  //this.setLoading(true);
//   axios.get('http://localhost:8002/users').then(response => {
//     //this.setLoading(false);
//     console.log(response.data);
//   }).catch(error => {
//     //this.setLoading(false);

//   });
  return (
    <div>
      Welcome Mr Admin !<br /><br />
    </div>
  );}
}

export default UserList;