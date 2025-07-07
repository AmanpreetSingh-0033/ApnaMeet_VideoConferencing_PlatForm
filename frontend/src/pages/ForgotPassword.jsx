// src/pages/ForgotPassword.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Snackbar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import client from "../utils/client"; // your axios baseURL client
import Footer from "./Footer";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await client.post("/send-otp", { email });
      localStorage.setItem("apnaMeet-reset-email", email); // persist across routes
      navigate("/verifyOtp");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      setError(msg);
      setOpen(true);
    }
  };

  return (
    <div className="auth-root">
      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIosNewIcon />}
        sx={{
          position: "absolute",
          top: 24,
          right: 32,
          background: "rgba(255,255,255,0.9)",
          color: "#7f53ac",
          border: "2px solid #7f53ac",
          fontWeight: 700,
          borderRadius: "18px",
          textTransform: "none",
          "&:hover": {
            background: "linear-gradient(to right, #647dee, #7f53ac)",
            color: "#fff",
          },
        }}
      >
        Go Back
      </Button>
      <div className="auth-content-wrapper">
        <div className="auth-right">
          <div className="auth-container">
            <h2>Forgot Password</h2>
            <TextField
              label="Enter your registered email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendOtp}
              sx={{
                background: "linear-gradient(90deg, #7f53ac 40%, #647dee 100%)",
                fontWeight: 700,
                fontSize: "1.05rem",
                borderRadius: "24px",
                textTransform: "none",
                mt: 2,
              }}
            >
              Send OTP
            </Button>
          </div>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <Footer />
    </div>
  );
}
