"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// ─── CORS — manual middleware (most reliable on Vercel serverless) ─────────────
const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5000",
    "https://ciphergpt-lakshay.vercel.app",
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    else if (!origin) {
        // Allow Postman / server-to-server requests
        res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
    // Respond immediately to preflight OPTIONS — must be 204
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
// ─── Security & Middleware ─────────────────────────────────────────────────────
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// Rate Limiter: 150 requests per 15 minutes per IP
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", limiter);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, morgan_1.default)("dev"));
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1", index_1.default);
// 404 — unknown API routes
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// 500 — global error handler
app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const message = process.env.NODE_ENV === "production"
        ? "An internal server error occurred"
        : err.message || "An internal server error occurred";
    res.status(status).json({ message });
});
exports.default = app;
//# sourceMappingURL=app.js.map