import React, { useState } from 'react';
import axios from 'axios';

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

    axios.put('http://localhost:8002/users/' + user.userId, { firstname: firstname.value, lastname: lastname.value }).then(response => {
        setLoading(false);
        setError('Name changes saved successfully.');
      }).catch(error => {
        setLoading(false);
        setError("Something went wrong. Please try again later.");
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
        setError(`Password updated successfully.`); //TODO NOTIFICATION
      }).catch(error => {
        setLoading(false);
        switch (error.response.data.errorKey) {
            case 'wrongPassword':
              setError("Invalid password");
              return;
            case 'alreadyUsedPassword':
              setError("Password is the same as old one");
              return;
            default:
              setError("Something went wrong. Please try again later.");
              return;
          }
      });
  }

  const handleEnterButton = (event) => {
    if (event.key === 'Enter') {
      handleUpdate();
    }
  }
  var user = JSON.parse(sessionStorage.user);

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