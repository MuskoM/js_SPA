import React, { useMemo } from 'react';
import axios from 'axios';
import Table from './Table';

class UserList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true
    };
  }

  async getUsersData (){
    const res = await axios.get('http://localhost:8002/users');
    console.log(res.data);
    this.setState({ loading: false, users: res.data });
  }

  render() {
    if (this.state.loading)
      this.getUsersData();
    console.log('users', this.state.users);
    const columns = [
      { Header: 'ID', accessor: 'userId', },
      { Header: 'Username', accessor: 'username', },
      { Header: 'Name', accessor: 'name', },
      { Header: 'Role', accessor: 'isAdmin', Cell: ({ cell: { value } }) => {
        console.log('Value', value);
        const role = value ? 'Administrator' : 'User';
        return (
          <>
            {role}
          </>
        );
      } },
    ];

    return (
      <div>
        <Table columns={columns} data={this.state.users} />
      </div>
    );
  }
}

export default UserList;