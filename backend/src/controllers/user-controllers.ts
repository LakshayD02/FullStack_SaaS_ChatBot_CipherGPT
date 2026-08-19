import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager";
import { COOKIE_NAME } from "../utils/constants";
import { sendMail } from "../utils/mail-sender";

// Cookie options for production (cross-origin) vs development
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  path: "/",
  httpOnly: true,
  signed: true,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  secure: isProduction,
  ...(isProduction ? {} : { domain: "localhost" }),
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get all users
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user signup
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered");
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, cookieOptions);

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, expires });

    return res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user login
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not registered");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password");
    }

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, cookieOptions);

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, expires });

    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    res.clearCookie(COOKIE_NAME, cookieOptions);

    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered or token invalid");
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).send("Email already in use");
      }
      user.email = email;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).send("Current password is required to set a new password");
      }
      const isCorrect = await compare(currentPassword, user.password);
      if (!isCorrect) {
        return res.status(403).send("Incorrect current password");
      }
      user.password = await hash(newPassword, 10);
    }

    await user.save();
    return res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("No account found with this email");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otpCode = otp;
    user.otpExpires = expires;
    await user.save();

    console.log(`[OTP DEBUG] Generated OTP for ${email}: ${otp}`);

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #008cff; text-align: center;">CipherGPT Verification</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Use the following 6-digit verification code to proceed. This OTP is valid for 10 minutes:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 4px; padding: 10px 20px; background: #f0f0f0; border-radius: 6px; color: #111;">${otp}</span>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Best regards,<br/>The CipherGPT Team</p>
      </div>
    `;

    await sendMail(email, "Password Reset Verification Code - CipherGPT", htmlContent);
    return res.status(200).json({ message: "OK", detail: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const resetPasswordWithOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.otpCode || user.otpCode !== otp) {
      return res.status(400).send("Invalid OTP code");
    }

    if (!user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).send("OTP code has expired");
    }

    user.password = await hash(newPassword, 10);
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: "OK", detail: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};
