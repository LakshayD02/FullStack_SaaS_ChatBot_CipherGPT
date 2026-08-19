"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_manager_1 = require("../utils/token-manager");
const validators_1 = require("../utils/validators");
const chat_controllers_1 = require("../controllers/chat-controllers");
//Protected API
const chatRoutes = (0, express_1.Router)();
chatRoutes.post("/new", (0, validators_1.validate)(validators_1.chatCompletionValidator), token_manager_1.verifyToken, chat_controllers_1.generateChatCompletion);
chatRoutes.get("/all-chats", token_manager_1.verifyToken, chat_controllers_1.sendChatsToUser);
chatRoutes.delete("/delete", token_manager_1.verifyToken, chat_controllers_1.deleteChats);
// Individual thread routes
chatRoutes.get("/thread/:threadId", token_manager_1.verifyToken, chat_controllers_1.getThreadMessages);
chatRoutes.delete("/thread/:threadId", token_manager_1.verifyToken, chat_controllers_1.deleteThread);
exports.default = chatRoutes;
//# sourceMappingURL=chat-routes.js.map