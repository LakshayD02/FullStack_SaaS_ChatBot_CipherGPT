import { Router } from "express";
import {
  getAllUsers,
  userLogin,
  userLogout,
  userSignup,
  verifyUser,
  updateProfile,
  sendOTP,
  resetPasswordWithOTP,
} from "../controllers/user-controllers";
import {
  loginValidator,
  signupValidator,
  validate,
} from "../utils/validators";
import { verifyToken } from "../utils/token-manager";

const userRoutes = Router();

userRoutes.get("/", verifyToken, getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);

// Profile and OTP features
userRoutes.put("/update-profile", verifyToken, updateProfile);
userRoutes.post("/send-otp", sendOTP);
userRoutes.post("/reset-password", resetPasswordWithOTP);

export default userRoutes;
