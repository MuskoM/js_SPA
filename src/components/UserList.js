import React from 'react';
import axios from 'axios';
import Table from "./Table";

class UserList extends React.Component{

  getUsers = () => {
    axios.get('http://localhost:8002/users').then(response => {
    //this.setLoading(false);
    console.log('responsedata',response.data);

    return response.data;

  }).catch(error => {
    //this.setLoading(false);
    console.log(error);
    return null;
  });

  }  

    render(){
  //this.setError(null);
  //this.setLoading(true);
      var users = this.getUsers();
      console.log('users',users);
  return (
    <div>
      {/* <Table users={response.data}></Table> */}
    </div>
  );
}}

export default UserList;