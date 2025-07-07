import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LockResetIcon from "@mui/icons-material/LockReset";
import Snackbar from "@mui/material/Snackbar";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import "../styles/Auth.css";
import Footer from "./Footer";
import "../styles/Footer.css";

import { AuthContext } from "../contexts/AuthContext";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formState, setFormState] = useState(0);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();
  const { handleRegister, handleLogin } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (formState === 0) {
        let result = await handleLogin(username, password);
        setMessage("Login successful!");
        setError("");
        setOpen(true);
        setTimeout(() => navigate("/home"), 1200);
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setUsername("");
        setPassword("");
        setName("");
        setError("");
        setFormState(0);
        setMessage(result || "Registration successful!");
        setOpen(true);
      }
    } catch (err) {
      let message = err?.response?.data?.message || "Something went wrong";
      setError(message);
      setOpen(true);
    }
  };

  const handleLoginFormState = () => {
    setFormState(0);
    setName("");
    setUsername("");
    setPassword("");
  };

  const handleRegisterFormState = () => {
    setFormState(1);
    setName("");
    setUsername("");
    setPassword("");
  };

  const handleForgotPass = () => {
    navigate("/forgotPassword");
  };

  return (
    <div className="auth-root">
      <div className="auth-goback-wrapper">
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIosNewIcon />}
          className="auth-goback-btn"
          sx={{
            background: "rgba(255,255,255,0.85)",
            color: "#7f53ac",
            border: "2px solid #7f53ac",
            fontWeight: 700,
            fontSize: "1.05rem",
            borderRadius: "18px",
            boxShadow: "0 2px 8px #7f53ac22",
            textTransform: "none",
            position: "absolute",
            top: 24,
            right: 32,
            zIndex: 10,
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg, #647dee 0%, #7f53ac 100%)",
              color: "#fff",
              border: "2px solid #647dee",
              boxShadow: "0 4px 16px #647dee55",
            },
          }}
        >
          Go back
        </Button>
      </div>
      <div className="auth-content-wrapper">
        <div className="auth-left">
          <img
            className="auth-illustration"
            src="https://img.freepik.com/vecteurs-premium/page-formulaire-connexion-securisee-mot-passe-ordinateur-cadenas-icone-vectorielle-3d-style-minimal-dessin-anime_365941-1119.jpg?semt=ais_items_boosted&w=740"
            alt="Login Illustration"
          />
        </div>
        <div className="auth-right">
          <div className="auth-container">
            <img
              className="auth-logo-img"
              src="https://www.pngall.com/wp-content/uploads/15/Login-Transparent.png"
              alt="Login Logo"
            />
            <div className="auth-toggle-row">
              <Button
                variant="contained"
                onClick={handleLoginFormState}
                className={`auth-toggle-btn ${formState === 0 ? "active" : ""}`}
                startIcon={<LoginIcon />}
                sx={{
                  background:
                    formState === 0
                      ? "linear-gradient(90deg, #7f53ac 40%, #647dee 100%)"
                      : "rgba(127,83,172,0.07)",
                  color: formState === 0 ? "#fff" : "#7f53ac",
                  border: formState === 0 ? "none" : "2px solid #7f53ac",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  borderRadius: "18px",
                  boxShadow: formState === 0 ? "0 4px 18px #7f53ac33" : "none",
                  textTransform: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #647dee 0%, #7f53ac 100%)",
                    color: "#fff",
                    boxShadow: "0 8px 32px #647dee55",
                  },
                }}
              >
                Sign in
              </Button>
              <Button
                variant="contained"
                onClick={handleRegisterFormState}
                className={`auth-toggle-btn ${formState === 1 ? "active" : ""}`}
                startIcon={<PersonAddAltIcon />}
                sx={{
                  background:
                    formState === 1
                      ? "linear-gradient(90deg, #7f53ac 40%, #647dee 100%)"
                      : "rgba(127,83,172,0.07)",
                  color: formState === 1 ? "#fff" : "#7f53ac",
                  border: formState === 1 ? "none" : "2px solid #7f53ac",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  borderRadius: "18px",
                  boxShadow: formState === 1 ? "0 4px 18px #7f53ac33" : "none",
                  textTransform: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #647dee 0%, #7f53ac 100%)",
                    color: "#fff",
                    boxShadow: "0 8px 32px #647dee55",
                  },
                }}
              >
                Sign up
              </Button>
            </div>
            <form className="auth-form" onSubmit={handleAuth}>
              {formState === 1 && (
                <TextField
                  id="name"
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  className="auth-input"
                  margin="normal"
                />
              )}
              <TextField
                id="email"
                label="E-Mail"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                className="auth-input"
                margin="normal"
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                className="auth-input"
                margin="normal"
              />
              <Button
                variant="contained"
                type="submit"
                className="auth-submit-btn"
                fullWidth
                startIcon={
                  formState === 0 ? <LoginIcon /> : <PersonAddAltIcon />
                }
                sx={{
                  background:
                    "linear-gradient(90deg, #7f53ac 40%, #647dee 100%)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  mt: 2,
                  mb: 1,
                  boxShadow: "0 4px 18px #7f53ac33",
                  borderRadius: "24px",
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #647dee 0%, #7f53ac 100%)",
                    boxShadow: "0 8px 32px #647dee55",
                  },
                }}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>
              <Button
                onClick={handleForgotPass}
                variant="text"
                className="auth-forgot-btn"
                startIcon={<LockResetIcon />}
                sx={{
                  color: "#7f53ac",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    color: "#647dee",
                    background: "rgba(127,83,172,0.07)",
                  },
                }}
                fullWidth
              >
                Forgot password?
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Snackbar
        open={open && (!!error || !!message)}
        autoHideDuration={4000}
        onClose={() => {
          setOpen(false);
          setError("");
          setMessage("");
        }}
        message={error || message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{
          style: {
            background: error ? "#d32f2f" : "#43a047",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1rem",
          },
        }}
      />
      <Footer />
    </div>
  );
}
