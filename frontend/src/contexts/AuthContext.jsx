// import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HttpStatusCode } from "axios";
import server from "../environment";
import client from "../utils/client";
export const AuthContext = createContext();
// import { useState } from "react";

// const client = axios.create({
//   baseURL: "http://localhost:8000/apnaMeet/api/v1/users",
//   // withCredentials: true,
// });

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const [resetEmail, setResetEmail] = useState("");
  const [userData, setUserData] = useState({});
  const router = useNavigate();

  ///// handle register function

  const handleRegister = async (name, username, password) => {
    try {
      let req = await client.post("/register", {
        name,
        username,
        password,
      });

      if (req.status === HttpStatusCode.Created) {
        setUserData(req.data);
        console.log("Registration successful:", req.data);
        return req.data.message;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let req = await client.post("/login", {
        username,
        password,
      });

      console.log(username, password);
      console.log(req.data);

      if (req.status === HttpStatusCode.Ok) {
        setUserData(req.data);
        console.log("req.data : -> ", req.data.user.token);
        localStorage.setItem("token", req.data.user.token);
        console.log("Login successful:", req.data);
        return req.data.message;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // add to activity
  const addToUserHistory = async (meetingCode) => {
    console.log("i am in console.log");
    console.log(`token  : ${localStorage.getItem("token")}`);
    try {
      let request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      return request;
    } catch (e) {
      throw e;
    }
  };

  //  get user activity
  const getHistoryOfUser = async () => {
    try {
      let request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data;
    } catch (err) {
      throw err;
    }
  };

  ///////////// Send OTP for password reset /////////////
  const sendOtp = async (email) => {
    try {
      const res = await client.post("/send-otp", { email });
      setResetEmail(email);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  ///////////// Verify OTP /////////////
  const verifyOtp = async (otp) => {
    try {
      const res = await client.post("/verify-otp", {
        email: resetEmail,
        otp,
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  ///////////// Reset Password /////////////
  const resetPassword = async (otp, newPassword) => {
    try {
      const res = await client.post("/reset-password", {
        email: resetEmail,
        otp,
        newPassword,
      });
      setResetEmail(""); // clear after use
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  //////////////////////////////////////////

  const data = {
    userData,
    setUserData,
    addToUserHistory,
    getHistoryOfUser,
    handleRegister,
    handleLogin,
    sendOtp,
    verifyOtp,
    resetPassword,
    resetEmail,
    setResetEmail,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
