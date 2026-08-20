import mongoose from "mongoose";

let isConnected = false;

async function connectToDatabase() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    // Only force IPv4 on local Windows dev to bypass Windows c-ares bug
    if (process.platform === "win32" && process.env.NODE_ENV !== "production") {
      opts.family = 4;
    }

    const db = await mongoose.connect(process.env.MONGODB_URL!, opts);
    isConnected = db.connections[0].readyState === 1;
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw new Error("Could not Connect To MongoDB");
  }
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    isConnected = false;
  } catch (error) {
    console.log(error);
    throw new Error("Could not Disconnect From MongoDB");
  }
}

export { connectToDatabase, disconnectFromDatabase };

