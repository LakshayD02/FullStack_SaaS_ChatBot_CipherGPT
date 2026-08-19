"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connection_1 = require("./db/connection");
// Connect to DB on cold start
(0, connection_1.connectToDatabase)().catch((err) => console.error("DB connection error:", err));
// Export Express app as the Vercel serverless handler
exports.default = app_1.default;
//# sourceMappingURL=api.js.map