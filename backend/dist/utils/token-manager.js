"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
exports.createToken = createToken;
const verifyToken = async (req, res, next) => {
    // Debug: log incoming auth headers (remove after confirming fix)
    console.log("[verifyToken] authorization:", req.headers.authorization ? "present" : "missing");
    console.log("[verifyToken] x-auth-token:", req.headers["x-auth-token"] ? "present" : "missing");
    // Helper to verify a raw JWT string
    const verifyJWT = (raw) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(raw, process.env.JWT_SECRET, (err, success) => {
        if (err)
            return reject(err);
        res.locals.jwtData = success;
        resolve();
    }));
    // 1. Authorization: Bearer <token>  (standard)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        try {
            await verifyJWT(authHeader.slice(7).trim());
            return next();
        }
        catch {
            return res.status(401).json({ message: "Token Expired" });
        }
    }
    // 2. x-auth-token: <token>  (custom header — survives Vercel proxy stripping)
    const customHeader = req.headers["x-auth-token"];
    if (customHeader && typeof customHeader === "string") {
        try {
            await verifyJWT(customHeader.trim());
            return next();
        }
        catch {
            return res.status(401).json({ message: "Token Expired" });
        }
    }
    // 3. Signed cookie (local dev fallback)
    const cookieToken = req.signedCookies[`${constants_1.COOKIE_NAME}`];
    if (cookieToken && cookieToken.trim() !== "") {
        try {
            await verifyJWT(cookieToken.trim());
            return next();
        }
        catch {
            return res.status(401).json({ message: "Token Expired" });
        }
    }
    return res.status(401).json({ message: "Token Not Received" });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=token-manager.js.map