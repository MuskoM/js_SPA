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
    this.handleChange = this.handleChange.bind(this);
    this.editUser = this.editUser.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked: checked });
  }

  editUser = (idx) => {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    console.log(`edit user ${idx}`);
    console.log(this.state.users[idx]);
    //this.state.currentUser = this.state.users[idx];
    console.log('currentUser', this.state.currentUser);

    this.setState({ currentUser: this.state.users[idx] });
    console.log('currentUser2', this.state.currentUser);
    console.log(this.state);
  };

  hideModal = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  saveChanges = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    console.log('checked',this.state.checked);
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
            onClick={() => this.editUser(cellObj.row.index)}
          >
            Edit
          </button>
        ),
      },
    ];

    const roles = [
      { key: "Admin", text: "Administrator" },
      { key: "User", text: "User" },
    ];

    return (
      <div>
        <Table columns={columns} data={this.state.users} />
        <div id="myModal" class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => this.hideModal()}>&times;</span>
            <h3>Edit user:</h3>
            <p>Username: {this.currentUser != undefined ? this.state.currentUser.username : ''}</p>
            <p>Name: {this.currentUser != undefined ? this.state.currentUser.name : ''}</p>
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
