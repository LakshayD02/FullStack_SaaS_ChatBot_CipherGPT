import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
config();

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Must be FIRST — before helmet, body parser, and all routes
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://ciphergpt-lakshay.vercel.app", // production frontend
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

// Handle preflight OPTIONS requests for ALL routes explicitly
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// ─── Security & Middleware ─────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Rate Limiter: 150 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1", appRouter);

// 404 — unknown API routes
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 500 — global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "An internal server error occurred"
      : err.message || "An internal server error occurred";
  res.status(status).json({ message });
});

export default app;
