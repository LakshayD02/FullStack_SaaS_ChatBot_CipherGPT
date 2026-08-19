import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import { chatCompletionValidator, validate } from "../utils/validators";
import {
  deleteChats,
  generateChatCompletion,
  sendChatsToUser,
  getThreadMessages,
  deleteThread,
} from "../controllers/chat-controllers";

//Protected API
const chatRoutes = Router();
chatRoutes.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);

// Individual thread routes
chatRoutes.get("/thread/:threadId", verifyToken, getThreadMessages);
chatRoutes.delete("/thread/:threadId", verifyToken, deleteThread);

export default chatRoutes;
