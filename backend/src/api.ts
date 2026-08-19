import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

// Connect to DB once (Vercel serverless - no app.listen())
connectToDatabase().catch((err) => console.error("DB connection error:", err));

// Export the Express app as the default handler for Vercel
export default app;
