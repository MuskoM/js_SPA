import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../utils/Common';

function EditUser(props) {
  const [loading, setLoading] = useState(false);
  const password = useFormInput('');
  const firstname = useFormInput('');
  const lastname = useFormInput('');
  const confirmPassword = useFormInput('');
  const oldPassword = useFormInput('');
  const [error, setError] = useState(null);

  const handleUpdate = () => {
    setError(null);
    setLoading(true);
    if (firstname.value == undefined || lastname.value == undefined){
        setLoading(false);
        setError("Name cannot be empty");
        return;
    }
    console.log(firstname.value);
    axios.put('http://localhost:8002/users/' + user.userId, { firstname: firstname.value, lastname: lastname.value }).then(response => {
        setLoading(false);
        console.log(response.data);
      }).catch(error => {
        setLoading(false);
        setLoading(false);
        setError("Something went wrong. Please try again later." + error); //TODO change error
      });
  }

  const handleCredentialsUpdate = () => {
    setError(null);
    setLoading(true);
    if (confirmPassword.value != password.value) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    var user = JSON.parse(sessionStorage.user);

    axios.put('http://localhost:8002/users/' + user.userId, { password: password.value, oldPassword: oldPassword.value }).then(response => {
        setLoading(false);
        console.log(response.data);
        axios.post('http://localhost:8002/users/signin', { username: response.data.username, password: password.value }).then(response => {
          setLoading(false);
          setUserSession(response.data.token, response.data.user);
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
        console.log(error.response.data)
        switch (error.response.data.errorKey) {
            case 'wrongPassword':
              setError("Invalid password");
              break;
            case 'alreadyUsedPassword':
              setError("Password is the same as old one");
              break;
            default:
              setError("Something went wrong. Please try again later.");
              break;
          }
      });
  }

  const handleEnterButton = (event) => {
    if (event.key === 'Enter') {
      handleUpdate();
    }
  }
  var user = JSON.parse(sessionStorage.user);
  console.log(user);
  var res = axios.get("http://localhost:8002/users/" + user.userId).then(response => {

  });
  console.log(res.data);
  return (
    <div id="centered">
      <h3>User Edit</h3><br /><br />
      <div>
        Firstname<br />
        <input type="text" {...firstname} placeholder={user.name} autoComplete="new-password" class="form-control" onKeyDown={handleEnterButton} minLength='1' maxLength='20'/>
      </div>
      <div>
        Lastname<br />
        <input type="text" {...lastname} placeholder={user.lastname} autoComplete="new-password" class="form-control" onKeyDown={handleEnterButton} minLength='1' maxLength='20'/>
      </div>
      <input type="button" class="btn btn-primary" value={loading ? 'Loading...' : 'Submit'} onClick={handleUpdate} disabled={loading} /><br />

      <div style={{ marginTop: 10 }}>
        Old Password<br />
        <input type="password" {...oldPassword} autoComplete="new-password" class="form-control" onKeyDown={handleEnterButton} minLength='1' maxLength='20'/>
      </div> 
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" class="form-control" onKeyDown={handleEnterButton} minLength='1' maxLength='20'/>
      </div>      
      <div style={{ marginTop: 10 }}>
        Confirm Password<br />
        <input type="password" {...confirmPassword} autoComplete="new-password" class="form-control" onKeyDown={handleEnterButton} minLength='1' maxLength='20'/>
      </div>
      <input type="button" class="btn btn-primary" value={loading ? 'Loading...' : 'Submit'} onClick={handleCredentialsUpdate} disabled={loading} /><br />

      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
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

export default EditUser;