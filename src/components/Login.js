import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "../utils/Common";
import { Paper, TextField } from "@material-ui/core";
import PrimaryButton from "./Buttons";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios
      .post("http://localhost:8002/users/signin", {
        username: username.value,
        password: password.value,
      })
      .then((response) => {
        setLoading(false);
        setUserSession(response.data.token, response.data.user);
        props.history.push("/dashboard");
        window.location.reload(false); //TODO: zobaczyć czy się da zmienić kolejnośc
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status !== 401 && error.response.status !== 400) {
          setError("Invalid password or login");
          return;
        }
        console.log(error.response.data.errorKey);
        switch (error.response.data.errorKey) {
          case "invalidCredentials":
            setError("Invalid password or login");
            break;
          case "userNotFound":
            setError("Invalid password or login");
            break;
          default:
            setError("Invalid password or login.");
            break;
        }
      });
  };

  const handleEnterButton = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div id="centered">
      <div className="login-form-header">
        <Paper style={{ backgroundColor: "#ffd400", padding: ".5rem" }}>
          <h3>Hey, want to come in?</h3>
        </Paper>
      </div>

      <div className="login-panel">
        <div className="credentials-input">
          <TextField
            variant="outlined"
            label="Username"
            {...username}
            autoComplete="new-password"
            onKeyDown={handleEnterButton}
            minLength="1"
            maxLength="20"
            style={{ marginBottom: ".5rem" }}
          ></TextField>
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            {...password}
            autoComplete="new-password"
            onKeyDown={handleEnterButton}
            minLength="1"
            maxLength="20"
          ></TextField>
        </div>
        <div className="login-form-button">
          <PrimaryButton
            value={loading ? "Loading..." : "Login"}
            onClick={handleLogin}
            disabled={loading}
            style={{ padding: ".2rem", marginBottom: ".3rem" }}
          >
            Log in
          </PrimaryButton>
        </div>
      </div>

    
      {error && (
        <>
          <small style={{ color: "red" }}>{error}</small>
          <br />
        </>
      )}
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

export default Login;
