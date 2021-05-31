import React from "react";
import axios from "axios";
import Table from "./Table";
import Popup from "./Popup";
import { Dropdown, Selection } from "react-dropdown-now";
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      showPopup: false,
    };
  }

  editUser = (idx) => {
    console.log(`edit user ${idx}`);
    console.log(this.state.users[idx]);
    this.setState({
      showPopup: !this.state.showPopup,
    });
  };

  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  };

  async getUsersData() {
    const res = await axios.get("http://localhost:8002/users");
    this.setState({ loading: false, users: res.data, isShowingPopup: false });
  }

  render() {
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
        {this.state.showPopup ? (
          <div className="popup">
            <div className="popup_inner">
              <h1>Zmień uprawnienia użytkownika</h1>
              <div className="popup_dropdown">
                <Dropdown
                  placeholder="Select role"
                  options={["User", "Administrator"]}
                  value="User"
                  onChange={(value) => console.log("change!", value)}
                  onSelect={(value) => console.log("selected!", value)} // always fires once a selection happens even if there is no change
                  onClose={(closedBySelection) =>
                    console.log("closedBySelection?:", closedBySelection)
                  }
                  onOpen={() => console.log("open!")}
                />
              </div>
              <button
                class="btn btn-primary"
                onClick={this.togglePopup.bind(this)}
              >
                Zatwierdź
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default UserList;
