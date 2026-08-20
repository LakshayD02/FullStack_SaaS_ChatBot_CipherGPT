import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Debug: log incoming auth headers (remove after confirming fix)
  console.log("[verifyToken] authorization:", req.headers.authorization ? "present" : "missing");
  console.log("[verifyToken] x-auth-token:", req.headers["x-auth-token"] ? "present" : "missing");

  // Helper to verify a raw JWT string
  const verifyJWT = (raw: string) =>
    new Promise<void>((resolve, reject) =>
      jwt.verify(raw, process.env.JWT_SECRET, (err, success) => {
        if (err) return reject(err);
        res.locals.jwtData = success;
        resolve();
      })
    );

  // 1. Authorization: Bearer <token>  (standard)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    try {
      await verifyJWT(authHeader.slice(7).trim());
      return next();
    } catch {
      return res.status(401).json({ message: "Token Expired" });
    }
  }

  // 2. x-auth-token: <token>  (custom header — survives Vercel proxy stripping)
  const customHeader = req.headers["x-auth-token"];
  if (customHeader && typeof customHeader === "string") {
    try {
      await verifyJWT(customHeader.trim());
      return next();
    } catch {
      return res.status(401).json({ message: "Token Expired" });
    }
  }

  // 3. Signed cookie (local dev fallback)
  const cookieToken = req.signedCookies[`${COOKIE_NAME}`];
  if (cookieToken && cookieToken.trim() !== "") {
    try {
      await verifyJWT(cookieToken.trim());
      return next();
    } catch {
      return res.status(401).json({ message: "Token Expired" });
    }
  }

  return res.status(401).json({ message: "Token Not Received" });
};
