import React, { useState } from "react";
import axios from "axios";
import { store } from "react-notifications-component";
import { Paper, TextField } from "@material-ui/core";
import PrimaryButton from "./Buttons";

function EditUser(props) {
  const [loading, setLoading] = useState(false);
  const password = useFormInput("");
  const firstname = useFormInput("");
  const lastname = useFormInput("");
  const confirmPassword = useFormInput("");
  const oldPassword = useFormInput("");
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const notification = {
    title: "Test notification",
    message: "You shouldn't see it here.",
    type: "success",
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  };

  const handleUpdate = () => {
    setError(null);
    setLoading(true);
    if (firstname.value === undefined || lastname.value === undefined) {
      setLoading(false);
      setError("Name cannot be empty");
      store.addNotification({
        ...notification,
        title: "Error!",
        message: "Name cannot be empty.",
        type: "danger",
      });
      return;
    }

    axios
      .put("http://localhost:8002/users/" + user.userId, {
        firstname: firstname.value,
        lastname: lastname.value,
      })
      .then((response) => {
        setLoading(false);
        setError("Name changes saved successfully.");
        store.addNotification({
          ...notification,
          title: "Success!",
          message: "Name changes saved successfully.",
          type: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        setError("Something went wrong. Please try again later.");
        store.addNotification({
          ...notification,
          title: "Error!",
          message: "Something went wrong. Please try again later.",
          type: "danger",
        });
      });
  };

  const handleCredentialsUpdate = () => {
    setError(null);
    setLoading(true);
    if (confirmPassword.value !== password.value) {
      setError("Passwords don't match");
      store.addNotification({
        ...notification,
        title: "Error!",
        message: "Passwords don't match.",
        type: "danger",
      });
      setLoading(false);
      return;
    }
    var user = JSON.parse(sessionStorage.user);

    axios
      .put("http://localhost:8002/users/" + user.userId, {
        password: password.value,
        oldPassword: oldPassword.value,
      })
      .then((response) => {
        setLoading(false);
        setError(`Password updated successfully.`); //TODO NOTIFICATION
        store.addNotification({
          ...notification,
          title: "Success!",
          message: "Password updated successfully.",
          type: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        switch (error.response.data.errorKey) {
          case "wrongPassword":
            setError("Invalid password");
            store.addNotification({
              ...notification,
              title: "Error!",
              message: "Invalid password.",
              type: "danger",
            });
            return;
          case "alreadyUsedPassword":
            setError("Password is the same as old one");
            store.addNotification({
              ...notification,
              title: "Error!",
              message: "Password is the same as the old one.",
              type: "danger",
            });
            return;
          default:
            setError("Something went wrong. Please try again later.");
            store.addNotification({
              ...notification,
              title: "Error!",
              message: "Something went wrong. Please try again later.",
              type: "danger",
            });
            return;
        }
      });
  };

  const handleEnterButton = (event) => {
    if (event.key === "Enter") {
      handleUpdate();
    }
  };
  var user = JSON.parse(sessionStorage.user);

  console.log(user);

  return (
    <div className="edit-panel">
      <div className="user-edit-forms-header">
        <Paper style={{ backgroundColor: "#ffd400", padding: ".5rem" }}>
          <h3>User Panel</h3>
        </Paper>
      </div>
      <div className="user-edit-forms">
        <div className="user-edit-form">
          <Paper
            style={{
              backgroundColor: "#ffd400",
              textAlign: "center",
              padding: ".3rem",
              marginBottom: ".3rem",
            }}
          >
            <h3>Edit Details</h3>
          </Paper>
          <Paper
            style={{
              backgroundColor: "#7bb2d9",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            <div id="user-edit-field">
              <TextField
                id="user-edit-field"
                placeholder={user.name}
                autoComplete="new-password"
                variant="outlined"
                onKeyDown={handleEnterButton}
                label="First Name"
                {...firstname}
              ></TextField>
            </div>
            <div id="user-edit-field">
              <TextField
                id="user-edit-field"
                placeholder={user.lastname}
                variant="outlined"
                autoComplete="new-password"
                onKeyDown={handleEnterButton}
                label="Last Name"
                {...lastname}
              ></TextField>
            </div>
            <div id="user-edit-field">
              <PrimaryButton
                value={loading ? "Loading..." : "Submit"}
                onClick={handleUpdate}
                disabled={loading}
              >
                Submit
              </PrimaryButton>
            </div>
          </Paper>
        </div>
        <div className="user-edit-form">
          <Paper
            style={{
              backgroundColor: "#ffd400",
              textAlign: "center",
              padding: ".3rem",
              marginBottom: ".3rem",
            }}
          >
            <h3>Change Password</h3>
          </Paper>
          <Paper
            style={{
              backgroundColor: "#7bb2d9",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            <div id="user-edit-field">
              <TextField
                id="user-edit-field"
                variant="outlined"
                {...oldPassword}
                onKeyDown={handleEnterButton}
                type="password"
                label="Old Password"
              ></TextField>
            </div>
            <div id="user-edit-field">
              <TextField
                id="user-edit-field"
                variant="outlined"
                onKeyDown={handleEnterButton}
                label="New Password"
                type="password"
                {...password}
              ></TextField>
            </div>
            <div id="user-edit-field">
              <TextField
                id="user-edit-field"
                variant="outlined"
                onKeyDown={handleEnterButton}
                label="Confirm Password"
                type="password"
                {...confirmPassword}
              ></TextField>
            </div>
            <div id="user-edit-field">
              <PrimaryButton
                value={loading ? "Loading..." : "Submit"}
                onClick={handleCredentialsUpdate}
                disabled={loading}
              >
                Submit
              </PrimaryButton>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default EditUser;
