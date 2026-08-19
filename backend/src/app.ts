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

// Security Headers
app.use(helmet());

// Rate Limiter: limit requests from same IP to 150 per 15 mins
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Dynamic CORS configurations
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

// 404 — unknown API routes
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 500 — global error handler (prevents stack trace leakage to clients)
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "An internal server error occurred"
      : err.message || "An internal server error occurred";
  res.status(status).json({ message });
});

export default app;
