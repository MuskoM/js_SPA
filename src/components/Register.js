import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../utils/Common';
import { Paper, TextField } from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "./Buttons";

function Register(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const firstname = useFormInput('');
  const lastname = useFormInput('');
  const confirmPassword = useFormInput('');
  const [error, setError] = useState(null);

  const handleRegister = () => {
    // let userId;
    setError(null);
    setLoading(true);
    if (confirmPassword.value !== password.value) {
      setLoading(false);
      setError("Passwords don't match");
      return;
    }
    if (firstname.value === "" || lastname.value === "") {
      setLoading(false);
      setError("Name cannot be empty");
      return;
    }
    var pattern=new RegExp("[A-Za-z]+$");
    if (!pattern.test(firstname.value) || !pattern.test(lastname.value)){
      setLoading(false);
      setError("Names cannot contains numbers");
      return;
    }
    axios.post('http://localhost:8002/users', { username: username.value, password: password.value, firstname: firstname.value, lastname: lastname.value }).then(response => {
      setLoading(false);
      axios.post('http://localhost:8002/users/signin', { username: username.value, password: password.value }).then(response => {
        setLoading(false);
        setUserSession(response.data.token, response.data.user);
        props.history.push('/dashboard')
        window.location.reload(false);
      }).catch(error => {
        setLoading(false);
        if (error.response.status !== 401 && error.response.status !== 400) {
          setError("Something went wrong. Please try again later.");
          return;
        }
        console.log(error.response.data.errorKey);
        switch (error.response.data.errorKey) {
          case 'invalidCredentials':
            setError("Invalid password or login");
            break;
          case 'userNotFound':
            setError("Invalid password or login");
            break;
          default:
            setError("Something went wrong. Please try again later.");
            break;
        }
      });
    }).catch(error => {
      setLoading(false);
      setLoading(false);
      if (error.response.status !== 500) {
        setError("Something went wrong. Please try again later.");
        return;
      }
      console.log(error.response.data.errorKey);
      switch (error.response.data.errorKey) {
        case 'usernameOccupied':
          setError("Username already in use");
          break;
        default:
          setError("Something went wrong. Please try again later.");
          break;
      }
    });
  }

  const handleEnterButton = (event) => {
    if (event.key === 'Enter') {
      handleRegister();
    }
  }

  return (
    <div id="centered">
      <div className="user-register-forms">
        <div className="user-register-form">
          <Paper style={{ backgroundColor: "#ffd400", textAlign: "center", padding: ".3rem", marginBottom: ".3rem", }}>
            <h3>Register</h3>
          </Paper>
          <Paper style={{ backgroundColor: "#7bb2d9", textAlign: "center", padding: "1rem", }} >
            <div id="user-edit-field">
              <TextField id="user-edit-field" autoComplete="new-password" variant="outlined" onKeyDown={handleEnterButton} label="Username" {...username} minLength='1' maxLength='20'></TextField>
            </div>
            <div id="user-edit-field">
              <TextField id="user-edit-field" autoComplete="new-password" variant="outlined" onKeyDown={handleEnterButton} label="First Name" {...firstname} minLength='1' maxLength='20' ></TextField>
            </div>
            <div id="user-edit-field">
              <TextField id="user-edit-field" autoComplete="new-password" variant="outlined" onKeyDown={handleEnterButton} label="Last Name" {...lastname} minLength='1' maxLength='20' ></TextField>
            </div>
            <div id="user-edit-field">
              <TextField id="user-edit-field" type="password" autoComplete="new-password" variant="outlined" onKeyDown={handleEnterButton} label="Password" {...password} minLength='1' maxLength='20'></TextField>
            </div>
            <div id="user-edit-field">
              <TextField type="password" id="user-edit-field" autoComplete="new-password" variant="outlined" onKeyDown={handleEnterButton} label="Confirm Password" {...confirmPassword} minLength='1' maxLength='20' ></TextField>
            </div>
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
            <div id="user-edit-field">
              <PrimaryButton value={loading ? 'Loading...' : 'Register'} onClick={handleRegister} disabled={loading}>Register</PrimaryButton>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Register;