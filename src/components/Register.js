import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../utils/Common';

function Register(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const firstname = useFormInput('');
  const lastname = useFormInput('');
  const [error, setError] = useState(null);

  const handleRegister = () => {
    let userId;
    setError(null);
    setLoading(true);
    axios.post('http://localhost:8002/users', { username: username.value, password: password.value, firstname: firstname.value, lastname: lastname.value }).then(response => {
      setLoading(false);
      axios.post('http://localhost:8002/users/signin', { username: username.value, password: password.value }).then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      props.history.push('/dashboard')
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

  return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div>
        Firstname<br />
        <input type="text" {...firstname} autoComplete="new-password" />
      </div>
      <div>
        Lastname<br />
        <input type="text" {...lastname} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Register'} onClick={handleRegister} disabled={loading} /><br />
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