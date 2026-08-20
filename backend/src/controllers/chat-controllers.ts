import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { configureOpenAI } from "../config/openai-config";
import OpenAI from "openai";
import { randomUUID } from "crypto";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, threadId } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    let thread;
    if (threadId && threadId !== "new") {
      thread = user.threads.find((t) => t.id === threadId);
    }

    // If no thread found, create a new one
    if (!thread) {
      const title = message.length > 35 ? message.slice(0, 35) + "..." : message;
      const newThread = {
        id: randomUUID(),
        title,
        messages: [],
        createdAt: new Date(),
      };
      user.threads.push(newThread);
      thread = user.threads[user.threads.length - 1];
    }

    // Map existing messages to OpenAI format
    const chats = thread.messages.map(({ role, content }) => ({
      role,
      content,
    })) as OpenAI.Chat.ChatCompletionMessageParam[];
    
    // Add new user message to local array and the database document
    chats.push({ content: message, role: "user" });
    thread.messages.push({ content: message, role: "user" });

    // Free model fallback chain — tries each model in order until one succeeds
    const FREE_MODELS = [
      "nvidia/nemotron-3-ultra-550b-a55b:free",
      "deepseek/deepseek-chat:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "google/gemma-3-27b-it:free",
      "mistralai/mistral-7b-instruct:free",
    ];

    const openai = configureOpenAI();
    let chatResponse: any = null;
    let lastError: string = "";

    for (const model of FREE_MODELS) {
      try {
        chatResponse = await openai.chat.completions.create({ model, messages: chats });
        if (chatResponse.choices?.[0]?.message) {
          console.log(`[OpenRouter] Succeeded with model: ${model}`);
          break; // success — stop trying
        }
        // API returned but no valid choice — treat as failure
        const errMsg = (chatResponse as any).error?.message || "Empty response";
        console.warn(`[OpenRouter] Model ${model} returned no choices: ${errMsg}`);
        lastError = errMsg;
        chatResponse = null;
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        console.warn(`[OpenRouter] Model ${model} failed: ${errMsg}`);
        lastError = errMsg;
      }
    }

    const assistantMessage = chatResponse?.choices?.[0]?.message;
    if (!assistantMessage) {
      throw new Error(`All free models failed. Last error: ${lastError}`);
    }

    thread.messages.push({
      role: assistantMessage.role,
      content: assistantMessage.content || "Sorry, I couldn't formulate a response.",
    });

    // Mark nested subdocument array as modified so Mongoose persists it
    user.markModified("threads");
    await user.save();
    
    const plainMessages = thread.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    return res.status(200).json({ chats: plainMessages, threadId: thread.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", cause: (error as Error).message });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    
    // Return all thread summaries (id, title, date)
    const threadSummaries = user.threads.map((t) => ({
      id: t.id,
      title: t.title,
      createdAt: t.createdAt,
    }));
    
    return res.status(200).json({ message: "OK", threads: threadSummaries });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const getThreadMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { threadId } = req.params;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }

    const thread = user.threads.find((t) => t.id === threadId);
    if (!thread) {
      return res.status(404).send("Chat thread not found");
    }

    const messages = thread.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    return res.status(200).json({ message: "OK", chats: messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const deleteThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { threadId } = req.params;
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }

    const threadIndex = user.threads.findIndex((t) => t.id === threadId);
    if (threadIndex === -1) {
      return res.status(404).send("Chat thread not found");
    }

    user.threads.splice(threadIndex, 1);
    await user.save();

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    
    // @ts-ignore
    user.threads = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: (error as Error).message });
  }
};
