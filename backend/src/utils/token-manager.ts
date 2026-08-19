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
  // 1. Try Authorization Bearer header first (works cross-origin)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      if (err) {
        return res.status(401).json({ message: "Token Expired" });
      }
      res.locals.jwtData = success;
      return next();
    });
  }

  // 2. Fallback: signed cookie (local dev)
  const token = req.signedCookies[`${COOKIE_NAME}`];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({ message: "Token Expired" });
      } else {
        resolve();
        res.locals.jwtData = success;
        return next();
      }
    });
  });
};
