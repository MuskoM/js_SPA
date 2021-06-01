import React from "react";
import axios from "axios";
import Table from "./Table";
import Switch from "react-switch";
import { store } from 'react-notifications-component';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      currentUser: null,
      checked: false,
    };
  }

  notification = {
    title: "Test notification",
    message: "You shouldn't see it here.",
    type: "success",
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  }

  editUser = (row) => {
    var user = row.values;
    this.setState({ currentUser: user, checked: user.isAdmin });
    var username = document.getElementById("username");
    var name = document.getElementById("name");
    username.innerHTML = `Username: ${user.username}`;
    name.innerHTML = `Name: ${user.name}`;
    this.showModal("editModal");
  };

  deleteUser = (row) => {
    var user = row.values;
    var id = user.userId;
    this.setState({ currentUser: user });
    console.log(row.values);
    console.log(`Delete user with id ${id}`);
    var username = document.getElementById("usernameDelete");
    var name = document.getElementById("nameDelete");
    username.innerHTML = `Username: ${user.username}`;
    name.innerHTML = `Name: ${user.name}`;
    this.showModal("deleteModal");
  }

  handleChange = (checked) => {
    this.setState({ checked: checked });
  }

  submitDelete = () => {
    var modal = document.getElementById("deleteModal");
    modal.style.display = "none";
    var user = this.state.currentUser;
    axios.delete('http://localhost:8002/users/' + user.userId).then(response => {
      this.setState({ loading: true }); //To update data
      store.addNotification({
        ...this.notification,
        title: "Success!",
        message: "Deleted user from database.",
        type: "success"
      });
    }).catch(error => {
      console.log(error);
      store.addNotification({
        ...this.notification,
        title: "Error!",
        message: error,
        type: "danger"
      });
    });
  }

  saveChanges = () => {
    var modal = document.getElementById("editModal");
    modal.style.display = "none";
    var user = this.state.currentUser;
    user.isAdmin = this.state.checked;
    console.log('User to save:', user);
    axios.put('http://localhost:8002/users/' + user.userId, { username: user.username, isAdmin: user.isAdmin }).then(response => {
      this.setState({ loading: true }); //To update data
      store.addNotification({
        ...this.notification,
        title: "Success!",
        message: "Made changes in database.",
        type: "success"
      });
    }).catch(error => {
      console.log(error);
      store.addNotification({
        ...this.notification,
        title: "Error!",
        message: error,
        type: "danger"
      });
    });

  }

  showModal = (name) => {
    var modal = document.getElementById(name);
    modal.style.display = "block";
  }

  hideModal = (name) => {
    var modal = document.getElementById(name);
    modal.style.display = "none";
  }

  async getUsersData() {
    const res = await axios.get("http://localhost:8002/users");
    this.setState({ loading: false, users: res.data });
  }

  render() {
    var editModal = document.getElementById("editModal");
    var deleteModal = document.getElementById("deleteModal");

    window.onclick = function (event) {
      if (event.target == editModal) {
        editModal.style.display = "none";
      }
      if (event.target == deleteModal) {
        editModal.style.display = "none";
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
      {
        accessor: "[deleteButton]",
        Cell: (cellObj) => (
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => this.deleteUser(cellObj.row)}
          >
            Delete
          </button>
        ),
      },
    ];

    return (
      <div>
        <Table columns={columns} data={this.state.users} />
        <div id="editModal" class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => this.hideModal("editModal")}>&times;</span>
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
        <div id="deleteModal" class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => this.hideModal("deleteModal")}>&times;</span>
            <h3>Are you sure you want to delete user?</h3>
            <p id="usernameDelete">Username: </p>
            <p id="nameDelete">Name: </p>
            <button
              type="button"
              class="btn btn-primary btn-danger"
              onClick={() => this.submitDelete()}
            >Yes</button>
          </div>
        </div>
      </div >
    );
  }
}

export default UserList;
