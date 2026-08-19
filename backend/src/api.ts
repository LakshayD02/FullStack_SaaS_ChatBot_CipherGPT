import app from "./app";
import { connectToDatabase } from "./db/connection";

// Connect to DB on cold start
connectToDatabase().catch((err) => console.error("DB connection error:", err));

// Export Express app as the Vercel serverless handler
export default app;
