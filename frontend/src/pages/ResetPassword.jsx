// src/pages/ResetPassword.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Snackbar } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import client from "../utils/client";
import Footer from "./Footer";
import "../styles/Auth.css";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("apnaMeet-reset-email");
  const otp = localStorage.getItem("apnaMeet-reset-otp");

  const handleReset = async () => {
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      setOpen(true);
      return;
    }
    try {
      await client.post("/reset-password", {
        email,
        otp,
        newPassword,
      });
      localStorage.removeItem("apnaMeet-reset-email");
      localStorage.removeItem("apnaMeet-reset-otp");
      navigate("/auth");
    } catch (err) {
      const msg = err.response?.data?.message || "Password reset failed";
      setError(msg);
      setOpen(true);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-content-wrapper">
        <div className="auth-right">
          <div className="auth-container">
            <h2>Reset Password</h2>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              endIcon={<LockResetIcon />}
              onClick={handleReset}
              sx={{
                background: "linear-gradient(90deg, #7f53ac 40%, #647dee 100%)",
                fontWeight: 700,
                fontSize: "1.05rem",
                borderRadius: "24px",
                textTransform: "none",
                mt: 2,
              }}
            >
              Update Password
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
