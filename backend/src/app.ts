import express, { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
config();

const app = express();

// ─── CORS — manual middleware (most reliable on Vercel serverless) ─────────────
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://ciphergpt-lakshay.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Allow Postman / server-to-server requests
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie, x-auth-token"
  );

  // Respond immediately to preflight OPTIONS — must be 204
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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

// Ensure MongoDB is connected for every request (critical for serverless cold-starts)
app.use(async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { connectToDatabase } = await import("./db/connection");
    await connectToDatabase();
    next();
  } catch (err: any) {
    console.error("DB connection error in middleware:", err);
    return res.status(500).json({ message: "Database Connection Error", cause: err?.message || String(err) });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1", appRouter);

// 404 — unknown API routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// 500 — global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "An internal server error occurred"
      : err.message || "An internal server error occurred";
  res.status(status).json({ message });
});

export default app;
