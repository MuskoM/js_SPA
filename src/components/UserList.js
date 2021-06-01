import React from "react";
import axios from "axios";
import Table from "./Table";
import Switch from "react-switch";
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      currentUser: null,
      checked: false,
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.editUser = this.editUser.bind(this);
  }

  handleChange = (checked) => {
    this.setState({ checked: checked });
  }

  editUser = (row) => {
    var user = row.values;
    console.log('Row', row.values);
    this.setState({ currentUser: user, checked: user.isAdmin });
    console.log('currentUser', this.state.currentUser);
    var username = document.getElementById("username");
    var name = document.getElementById("name");
    username.innerHTML = `Username: ${user.username}`;
    name.innerHTML = `Name: ${user.name}`;
    this.showModal();
  };

  showModal = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    console.log('currentUser w show', this.state.currentUser);
  }

  hideModal = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    console.log('currentUser w hide', this.state.currentUser);
  }

  saveChanges = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    console.log('checked', this.state.checked);
    var user = this.state.currentUser;
    user.isAdmin = this.state.checked;
    console.log('User to save:', user);
    axios.put('http://localhost:8002/users/' + user.userId, { username: user.username, firstname: user.name, isAdmin: user.isAdmin }).then(response => {
      this.setState({ loading: true }); //To update data
    }).catch(error => {
      console.log(error); //TODO: notification
    });

  }

  async getUsersData() {
    const res = await axios.get("http://localhost:8002/users");
    this.setState({ loading: false, users: res.data });
  }

  render() {
    var modal = document.getElementById("myModal");

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    if (this.state.loading) this.getUsersData();
    const columns = [
      { Header: "ID", accessor: "userId" },
      { Header: "Username", accessor: "username" },
      { Header: "Name", accessor: "name" },
      {
        Header: "Role",
        accessor: "isAdmin",
        Cell: ({ cell: { value } }) => {
          const role = value ? "Administrator" : "User";
          return <>{role}</>;
        },
      },
      {
        accessor: "[editButton]",
        Cell: (cellObj) => (
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => this.editUser(cellObj.row)}
          >
            Edit
          </button>
        ),
      },
    ];

    return (
      <div>
        <Table columns={columns} data={this.state.users} />
        <div id="myModal" class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => this.hideModal()}>&times;</span>
            <h3>Edit user:</h3>
            <p id="username">Username: </p>
            <p id="name">Name: </p>
            <label htmlFor="normal-switch">
              <span>Administrator</span>
              <Switch
                onChange={this.handleChange}
                checked={this.state.checked}
                id="normal-switch"
              />
            </label>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => this.saveChanges()}
            >Submit</button>
          </div>
        </div>

      </div >
    );
  }
}

export default UserList;
