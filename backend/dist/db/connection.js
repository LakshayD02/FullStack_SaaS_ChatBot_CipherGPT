"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.disconnectFromDatabase = disconnectFromDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
async function connectToDatabase() {
    if (isConnected || mongoose_1.default.connection.readyState === 1) {
        isConnected = true;
        return;
    }
    try {
        const opts = {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        };
        // Only force IPv4 on local Windows dev to bypass Windows c-ares bug
        if (process.platform === "win32" && process.env.NODE_ENV !== "production") {
            opts.family = 4;
        }
        const db = await mongoose_1.default.connect(process.env.MONGODB_URL, opts);
        isConnected = db.connections[0].readyState === 1;
        console.log("Successfully connected to MongoDB");
    }
    catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw new Error("Could not Connect To MongoDB");
    }
}
async function disconnectFromDatabase() {
    try {
        await mongoose_1.default.disconnect();
        isConnected = false;
    }
    catch (error) {
        console.log(error);
        throw new Error("Could not Disconnect From MongoDB");
    }
}
//# sourceMappingURL=connection.js.map