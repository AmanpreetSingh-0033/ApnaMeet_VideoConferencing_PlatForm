import { Router } from "express";

import {
  register,
  login,
  addToHistory,
  getUserHistory,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/userController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/add_to_activity", addToHistory);
router.get("/get_all_activity", getUserHistory);

// Forgot Password Routes 👇
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
