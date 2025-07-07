import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

import User from "../models/userModel.js";
import { Meeting } from "../models/meetingModel.js";

import mailSender from "../utils/mailSender.js";

// ------------------------- EXISTING FUNCTIONS (Unchanged) -------------------------

const register = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const existUser = await User.findOne({ username });
    if (existUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }
    if (!name || !username || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Please fill all the fields" });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });
    let result = await newUser.save();
    console.log("User registered successfully:", result);
    return res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal server error => error in register the user" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please fill all the fields" });
  }
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      console.log(`${user.name} has token : ${token}`);
      await user.save();

      return res.status(httpStatus.OK).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          token: user.token,
        },
      });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error : error in login" });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    res.json({ message: `Something went wrong ${e} => error in getUserHistory` });
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;
  try {
    const user = await User.findOne({ token: token });

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e} error in addToHistiry` });
  }
};

// ------------------------- FORGOT PASSWORD FEATURE -------------------------

// 1. Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ username: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 min

    user.passwordResetToken = { token: otp, expires };
    await user.save();

    await mailSender(
      email,
      "Your ApnaMeet OTP",
      `Your OTP is: <b>${otp}</b><br/><br/>It will expire in 10 minutes.`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 2. Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ username: email });

    if (!user || !user.passwordResetToken) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    const { token, expires } = user.passwordResetToken;

    if (token !== otp || Date.now() > expires) {
      return res.status(400).json({ message: "OTP is invalid or has expired" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ username: email });

    if (!user || !user.passwordResetToken) {
      return res.status(404).json({ message: "Invalid request" });
    }

    const { token, expires } = user.passwordResetToken;

    if (token !== otp || Date.now() > expires) {
      return res.status(400).json({ message: "OTP is invalid or has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error : error in reSetPassword" });
  }
};

// ------------------------- EXPORT EXISTING CONTROLLERS -------------------------

export { register, login, getUserHistory, addToHistory };
